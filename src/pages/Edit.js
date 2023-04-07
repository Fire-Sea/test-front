import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector} from 'react-redux';
import '../styles/Edit.css';
import useDelete from '../hooks/useDeleteDetail';
import useGetTextData from '../hooks/useGetTextData';
import usePostDetail from '../hooks/usePostDetail';

function Edit(){
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const {category, id} = useParams();
  const editor = document.querySelector('.edit-body');
  const [fade, setFade] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [textData, setTextData] = useState({
    category: category,
    textTitle: '',
    textBody: ''
  })
  const {textTitle, textBody} = textData;
  const {deleteDetail} = useDelete();
  const {getTextData} = useGetTextData();
  const {postDetail} = usePostDetail(textData);
  // 글자 스타일 적용
  const setStyle = (style)=>{
    document.execCommand(style);
    focusEditor();
  }
  
  // 스타일 적용후 포커스
  const focusEditor = ()=>{
    editor.focus({preventScroll: true});
  }

  // textData null값 체크
  const checkValue = ()=>{
    if(!textTitle){
      alert('제목을 입력하세요');
    }
    else if(!textBody){
      alert('내용을 입력하세요');
    }
    else{
      postDetail();
    }
  };

  // textTitle 추출함수
  const onChange = (e)=>{
    setTextData({
      ...textData,
      textTitle: e.target.value
    });
  };
 // api/user/update?id=${}
  // textBody 추출함수
  // 첫줄에 p태그 부착
  const onInput = (e)=>{
    if(e.target.innerHTML.indexOf('<p>') === -1 && e.target.innerHTML != ''){
      const pElement = document.createElement('p');
      const firstLine = e.target.firstChild;
      pElement.appendChild(firstLine);
      editor.prepend(pElement);
    }
    setTextData({
      ...textData,
      textBody: e.target.innerHTML
    });
    console.log(e.target.innerHTML)
  };

  // 글 수정 요청함수
  const modifyBtn = ()=>{
    return(
      <>
      <button className='detail-removeBtn' onClick={deleteDetail}>글 삭제하기</button>
      <button className='edit-send' onClick={postDetail}>수정 완료하기</button>
      </>
    )
  }
  document.execCommand('defaultParagraphSeparator', false, 'p');
  
  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    if(id){
      (async ()=>{
        const data = await getTextData({parent: 'detail'});
        setTextData(data)
      })()
      
    }
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])
  if(loading){
    return(<div>로딩중</div>)
  }
  if(err){
    return(<div>에러가 발생했습니다.</div>)
  }
  return(
    <>
    {
      id
      ? <h1 className='edit-type'>글수정</h1>
      : <h1 className='edit-type'>글작성</h1>
    }
      <div className={'edit-container start ' + fade}>
        <input className='edit-title' placeholder='제목을 입력하세요' name='textTitle' value={textTitle}
        onChange={onChange}/>
        <div className="edit-menu">
          <button id="btn-bold" onClick={()=>{setStyle('bold');}}>
            <b>B</b>
          </button>
          <button id="btn-italic" onClick={()=>{setStyle('italic');}}>
            <i>I</i>
          </button>
          <button id="btn-underline" onClick={()=>{setStyle('underline');}}>
            <u>U</u>
          </button>
          <button id="btn-strike" onClick={()=>{setStyle('strikeThrough');}}>
            <s>S</s>
          </button>
          <button id="btn-ordered-list" onClick={()=>{setStyle('insertOrderedList');}}>
            OL
          </button>
          <button id="btn-unordered-list" onClick={()=>{setStyle('insertUnorderedList');}}>
            UL
          </button>
          <button id="btn-image">
            IMG
          </button>
        </div>
        <div className='edit-body' placeholder='내용을 작성하세요' contentEditable='true' //dangerouslySetInnerHTML={{__html: textBody}}
        onPaste={(e)=>{
          e.preventDefault();
          let pastedData = e.clipboardData || window.clipboardData;
          let text = pastedData.getData('text');
          window.document.execCommand('insertText', false, text);
        }} 
        onInput={onInput}>
        </div>
        <div className='edit-btn'>
          {
            id
            ? modifyBtn()
            : <button className='edit-send' onClick={checkValue}>글 저장하기</button>
          }
          <button className='edit-cancel' onClick={()=>navigate(-1)}>취소</button>
        </div>
      </div>
    </>
  )
}
  
export {Edit};