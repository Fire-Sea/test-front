import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Input } from '../Input';
import { changeLoginToggle } from '../store';
import axios from 'axios';
import '../styles/Edit.css';
import {useCookies} from 'react-cookie';

function Edit(){
  const [fade, setFade] = useState('');
  const {category} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const [cookies, setCookie, removeCookie] = useCookies();

  const editor = document.querySelector('.edit-body');


  const setStyle = (style)=>{
    document.execCommand(style);
    focusEditor();
  }
  const focusEditor = ()=>{
    editor.focus({preventScroll: true});
  }
  const getTextData = ()=>{
    const textTitle = document.querySelector('.edit-title').value;
    const pElement = document.createElement('p');
    const firstLine = editor.firstChild;
    pElement.appendChild(firstLine);
    editor.prepend(pElement);

    const textBody = editor.innerHTML;
    
    
    if(!textTitle){
      alert('제목을 입력하세요');
    }
    else if(!textBody){
      alert('내용을 입력하세요');
    }
    else{
      const textData = {
        category: category,
        textTitle: textTitle,
        textBody: textBody
      };
      sendTextData(textData);
    }
  }

  const sendTextData = (textData)=>{
    const expires = new Date();
    expires.setMinutes(expires.getMinutes()+300);

    axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
    axios.post(`http://${ip}/api/user/send`, textData)
      .then(res=>{
        let statusCode = res.data.statusCode;
        if(statusCode === 20000){
          alert('글이 저장되었습니다.');
          navigate(`/${category}/list`);
        }
        else{
          axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;
          axios.get(`http://${ip}/api/refresh`)
            .then(res=>{
              const statusCode = res.data.statusCode;
              res = res.headers;
              // 2-1. refresh_token: 5분이상 유효
              //      access_token 만 재발급 성공
              if(statusCode === 20010){
                console.log('2-1. refresh_token: 5분이상 유효');
                console.log('     access_token 재발급 성공');

                const token = {
                  access_token: res.access_token,
                  refresh_token: cookies.token.refresh_token
                }
                setCookie('token', token, {
                  expires: expires
                })
                axios.defaults.headers.common['Authorization'] = res.access_token;
                axios.post(`http://${ip}/api/user/send`, textData)
                  .then(res=>{
                    alert('글이 저장되었습니다.');
                    navigate(`/${category}/list`);
                  })
              }
              // 2-2. refresh_token: 5분미만 유효
              //      access_token, refresh_token 둘다 재발급 성공
              else if(statusCode === 20009){
                console.log('2-2. refresh_token: 5분미만 유효');
                console.log('     access_token, refresh_token 둘다 재발급 성공');
                const token = {
                  access_token: res.access_token,
                  refresh_token: res.refresh_token
                }
                setCookie('token', token, {
                  expires: expires
                })

                axios.defaults.headers.common['Authorization'] = res.access_token;
                axios.post(`http://${ip}/api/user/send`, textData)
                  .then(res=>{
                    alert('글이 저장되었습니다.');
                    navigate(`/${category}/list`);
                  })
              }
              // 2-3. refresh_token: 만료
              //      재로그인 하도록 유도
              else if(statusCode === 40009){
                console.log('2-3. refresh_token: 만료');
                console.log('     재로그인 하도록 유도');
                alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
                removeCookie('token', {path: '/'});
                dispatch(changeLoginToggle(true));
              }
              // 2-4. 기타 네트워크 문제
              else{
                console.log('2-4. 기타 네트워크 문제');
                alert('서버와 통신이 원할하지 않습니다. 잠시후 시도해주세요');
              }
            })
        }
      })
  }

  
  document.execCommand('defaultParagraphSeparator', false, 'p');
  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])
    
  return(
    <>
      <Input/>
      <div className={'edit-container start ' + fade}>
        <input className='edit-title' placeholder='제목을 입력하세요'/>
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
        <div className='edit-body' placeholder='내용을 작성하세요' contentEditable='true' onPaste={(e)=>{
          e.preventDefault();
          let pastedData = e.clipboardData || window.clipboardData;
          let text = pastedData.getData('text');
          window.document.execCommand('insertText', false, text);
        }}>
        </div>
        <div className='edit-btn'>
          <button className='edit-cancel' onClick={()=>navigate(-1)}>취소</button>
          <button className='edit-send' onClick={()=>{getTextData();}}
            >글 저장하기</button>
        </div>
      </div>
    </>
  )
}
// const sendTextData = (textData)=>{
//     axios.defaults.headers.common['Authorization'] = token.access_token;
//     axios.post(`http://${ip}/api/user/send`, textData);
//     alert('글이 저장되었습니다.');
//     navigate(`/${category}/list`);
//     console.log(textData);
//   }

//   const silentRefresh = (textData)=>{
//     axios.defaults.headers.common['Authorization'] = token.refresh_token;
//     axios.get(`http://${ip}/api/refresh`)
//       .then(res=>{
//         let statusCode = res.data.statusCode;
//         res = res.headers;
        
//         // 2-1. refresh_token: 5분이상 유효
//         //      access_token 만 재발급 성공
//         if(statusCode === 20010){
//           console.log('2-1. refresh_token: 5분이상 유효');
//           console.log('     access_token 재발급 성공');
//           dispatch(changeAccessToken({access_token: res.access_token}));
//           sendTextData(textData);
//         }
//         // 2-2. refresh_token: 5분미만 유효
//         //      access_token, refresh_token 둘다 재발급 성공
//         else if(statusCode === 20009){
//           console.log('2-2. refresh_token: 5분미만 유효');
//           console.log('     access_token, refresh_token 둘다 재발급 성공');
//           dispatch(changeBothToken({
//             access_token: res.access_token,
//             refresh_token: res.refresh_token
//           }));
//           console.log(token);
//           sendTextData(textData);
//         }
//         // 2-3. refresh_token: 만료 혹은 기타 문제
//         //      재로그인 하도록 유도
//         else{
//           console.log('2-3. refresh_token: 만료 혹은 기타 문제');
//           console.log('     재로그인 하도록 유도');
//           alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
//           dispatch(changeLoginStatus(false));
//           dispatch(changeLoginToggle(true));
//         }
//       })
//   }
//   const checkToken = (textData)=>{

//     axios.defaults.headers.common['Authorization'] = token.access_token;
//     axios.defaults.withCredentials = true;

//     axios.post(`http://${ip}/api/user/send`, textData)
//       .then(res=>{
//         let statusCode = res.data.statusCode;
//         console.log(token);
//         // 정상적으로 저장
//         if(statusCode === 20000){
//           alert('글이 저장되었습니다.');
//           navigate(`/${category}/list`);
//         }
//         // access_token 만료됨
//         else{
//           silentRefresh(textData);
//         }
//       })
//   }
//   const getInputData = ()=>{
//     const textTitle = document.querySelector('.edit-title').value;
//     const textBody = document.querySelector('.edit-body').value;

//     if(!textTitle){
//       alert('제목을 입력하세요');
//     }
//     else if(!textBody){
//       alert('내용을 입력하세요');
//     }
//     else{
//       let textData = {
//         category: category, 
//         textTitle: textTitle,
//         textBody: textBody
//       };
//       checkToken(textData);
//     }
//   }
  export {Edit};