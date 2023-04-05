import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { changeLoginStatus } from '../store';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import '../styles/Edit.css';

function Edit(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const [cookies, setCookie, removeCookie] = useCookies();
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
      postData();
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
    console.log(textBody)
  };

  // textData POST전송
  const postData = async ()=>{
    try{
      setErr(null);
      setLoading(true);
      let response = {};

      if(cookies.token === undefined){
        console.log('0. 쿠키에 저장된 토큰이 없음');
        console.log('   로그인 하도록 유도');
        alert('로그인하세요.');
        return dispatch(changeLoginStatus(true));
      }
      if(id){
        response = await axios.patch(`http://${ip}/api/user/update?id=${id}`, textData);
      }
      else{
        response = await axios.post(`http://${ip}/api/user/send`, textData);
      }
      const statusCode = response.data.statusCode;
      
      if(statusCode === 20000){
        alert('글이 저장되었습니다.');
        navigate(`/list/${category}/0`);
      }
      else if(statusCode === 20015){
        alert('정상적으로 수정되었습니다.');
        navigate(`/list/${category}/0`);
      }
      else{
        silentRefresh();
      }
    } catch(e){
      setErr(e);
      console.log('서버와의 소통에 실패했습니다.')
    }
    setLoading(false);
  };

  // modify 버전 수정할 글 GET
  const getData = async ()=>{
    try{
      const response = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
  
      if(!response.data){
        alert('서버와의 소통에 실패했습니다.');
        navigate(-1);
      }
      else{
        setTextData(response.data);

      }
    }
    catch(e){
      setErr(e);
    }
  }
  
  // modify 버전 삭제한 글 DELETE
  const deleteData = async ()=>{
    try{
      if(cookies.token === undefined){
        console.log('0. 쿠키에 저장된 토큰이 없음');
        console.log('   로그인 하도록 유도');
        alert('로그인하세요.');
        return dispatch(changeLoginStatus(true));
      }
      const response = await axios.delete(`http://${ip}/api/user/delete?id=${id}`);
      const statusCode= response.data.statusCode;

      if(statusCode === 20016){
        alert('성공적으로 삭제되었습니다.');
        navigate(-1);
      }
    }
    catch(e){
      console.log(e);
    }
  }
  // access_token 만료시 재인증
  const silentRefresh = async ()=>{
    axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;
    const response = await axios.get(`http://${ip}/api/refresh`);
    const statusCode = response.data.statusCode;

    const expires = new Date();
    expires.setMinutes(expires.getMinutes()+300);

    if(statusCode === 20010){
      console.log('2-1. refresh_token: 5분이상 유효');
      console.log('     access_token 재발급 성공');

      const token = {
        access_token: response.headers.access_token,
        refresh_token: cookies.token.refresh_token
      }
      setCookie('token', token, {
        expires: expires
      })
      axios.defaults.headers.common['Authorization'] = response.headers.access_token;
      postData();
    }
    else if(statusCode === 20009){
      console.log('2-2. refresh_token: 5분미만 유효');
      console.log('     access_token, refresh_token 둘다 재발급 성공');

      const token = {
        access_token: response.headers.access_token,
        refresh_token: response.headers.refresh_token
      }
      setCookie('token', token, {
        expires: expires
      })
      axios.defaults.headers.common['Authorization'] = response.headers.access_token;
      postData();
    }
    else if(statusCode === 40009){
      console.log('2-3. refresh_token: 만료');
      console.log('     재로그인 하도록 유도');
      alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
      removeCookie('token', {path: '/'});
      dispatch(changeLoginStatus(true));
    }
    else{
      console.log('2-4. 기타 네트워크 문제');
      alert('서버와 통신이 원할하지 않습니다. 잠시후 시도해주세요');
    }
  }
  
  const modifyBtn = ()=>{
    return(
      <>
      <button className='detail-removeBtn' onClick={deleteData}>글 삭제하기</button>
      <button className='edit-send' onClick={postData}>수정 완료하기</button>
      </>
    )
  }
  document.execCommand('defaultParagraphSeparator', false, 'p');
  
  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    if(id){
      getData();
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
        <div className='edit-body' placeholder='내용을 작성하세요' contentEditable='true' dangerouslySetInnerHTML={{__html: textBody}}
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