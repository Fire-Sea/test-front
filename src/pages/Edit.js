import { Input } from '../Input';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import '../styles/Edit.css';
import { changeAccessToken, changeBothToken, changeLoginStatus, changeLoginToggle } from '../store';

function Edit(){
  const [fade, setFade] = useState('');
  const {category} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const token = useSelector((state)=> {return state.token});
  
  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('')
    }
  }, [])
    
  return(
    <>
      <Input/>
      <div className={'edit-container start ' + fade}>
        <input className='edit-title' placeholder='제목을 입력하세요'/>
        <textarea className='edit-body' autoComplete='no' placeholder='내용을 작성하세요'/>
        <div className='edit-btn'>
          <button className='edit-cancel' onClick={()=>navigate(-1)}>취소</button>
          <button className='edit-send' onClick={()=>{
            let textTitle = document.querySelector('.edit-title').value;
            let textBody = document.querySelector('.edit-body').value;
            
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

              axios.defaults.headers.common['Authorization'] = token.access_token;
              axios.post(`http://${ip}/api/user/send`, textData)
                .then(res=>{
                  let statusCode = res.data.statusCode;
                  if(statusCode === 20000){
                    alert('글이 저장되었습니다.');
                    navigate(`/${category}/list`);
                  }
                  else{
                    axios.defaults.headers.common['Authorization'] = token.refresh_token;
                    axios.get(`http://${ip}/api/refresh`)
                      .then(res=>{
                        const statusCode = res.data.statusCode;
                        res = res.headers;
                        // 2-1. refresh_token: 5분이상 유효
                        //      access_token 만 재발급 성공
                        if(statusCode === 20010){
                          console.log('2-1. refresh_token: 5분이상 유효');
                          console.log('     access_token 재발급 성공');
                          dispatch(changeAccessToken({
                            access_token: res.access_token
                          }))
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
                          dispatch(changeBothToken({
                            access_token: res.access_token,
                            refresh_token: res.refresh_token
                          }))
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
                          dispatch(changeLoginStatus(false));
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
              }}}
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