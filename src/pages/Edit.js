import { Input } from '../Input';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import '../styles/Edit.css';
import { changeAccessToken, changeBothToken, changeLoginStatus, changeLoginToggle } from '../store';

function Edit(){
  
    let token = useSelector((state)=> {return state.token});
    let navigate = useNavigate();
    let {category} = useParams();
    let ip = useSelector((state) => {return state.ip});
    let [fade, setFade] = useState('');
    let dispatch = useDispatch();

    useEffect(()=>{
      const fadeTimer = setTimeout(()=>{setFade('end')}, 100);
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
            <button className='edit-cancel' onClick={()=>{navigate(-1)}}>취소</button>


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
                axios.defaults.headers.common['Authorization'] = token.access_token;
                axios.defaults.withCredentials = true;

                axios.post(`http://${ip}/api/user/send`, {
                  category : category,
                  textTitle: textTitle,
                  textBody: textBody
                })
                  .then(res=>{
                    let statusCode = res.data.statusCode;
                    
                    // 정상적으로 저장
                    if(statusCode === 20000){
                      alert('글이 저장되었습니다.');
                      navigate(`/${category}/list`);
                    }
                    // access_token 만료됨
                    else{
                      axios.defaults.headers.common['Authorization'] = token.refresh_token;
                      axios.get(`http://${ip}/api/refresh`)
                        .then(res=>{
                          let statusCode = res.data.statusCode;
                          res = res.headers;
                          
                          // 2-1. refresh_token: 5분이상 유효
                          //      access_token 만 재발급 성공
                          if(statusCode === 20010){
                            console.log('2-1. refresh_token: 5분이상 유효');
                            console.log('     access_token 재발급 성공');
                            dispatch(changeAccessToken({access_token: res.access_token}));

                            axios.post(`http://${ip}/api/user/send`, {
                                        category : category,
                                        textTitle: textTitle,
                                        textBody: textBody
                                      });
                            alert('글이 저장되었습니다.');
                            navigate(`/${category}/list`);
                          }
                          // 2-2. refresh_token: 5분미만 유효
                          //      access_token, refresh_token 둘다 재발급 성공
                          else if(statusCode === 20009){
                            console.log('2-2. refresh_token: 5분미만 유효');
                            console.log('     access_token, refresh_token 둘다 재발급 성공');
                            dispatch(changeBothToken({
                              access_token: res.access_token,
                              refresh_token: res.refresh_token
                            }));
                            axios.post(`http://${ip}/api/user/send`, {
                                        category : category,
                                        textTitle: textTitle,
                                        textBody: textBody
                                      });
                            alert('글이 저장되었습니다.');
                            navigate(`/${category}/list`);
                          }
                          // 2-3. refresh_token: 만료 혹은 기타 문제
                          //      재로그인 하도록 유도
                          else{
                            console.log('2-3. refresh_token: 만료 혹은 기타 문제');
                            console.log('     재로그인 하도록 유도');
                            alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
                            dispatch(changeLoginStatus(false));
                            dispatch(changeLoginToggle(true));
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

  export {Edit};