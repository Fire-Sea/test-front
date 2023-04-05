import { useNavigate } from 'react-router-dom'
import '../styles/Edit.css'

function Modify(){
  const navigate = useNavigate();
  return(
      <>
      <h1 className='modify-title'>글수정</h1>
      <div className={'edit-container modify-version'}> 
      <input className='edit-title' placeholder='제목을 입력하세요' name='textTitle' value={'tsetsetsetwset'}/>
      <div className="edit-menu">
        {/* <button id="btn-bold" onClick={()=>{setStyle('bold');}}>
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
        </button> */}
      </div>
      <div className='edit-body' placeholder='내용을 작성하세요' contentEditable='true'>
      </div>
      <div className='edit-btn'>
        <button className='edit-cancel' onClick={()=>navigate(-1)}>취소</button>
        <button className='edit-send'>수정 완료하기</button>
      </div>
    </div>
      </>
  )
}
export {Modify}