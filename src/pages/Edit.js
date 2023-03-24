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
                axios.post(`http://${ip}/api/user/send`, {
                  category : category,
                  textTitle: textTitle,
                  textBody: textBody
                })
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
                          let statusCode = res.data.statusCode;
                          res = res.headers;
                          if(statusCode === 20010){
                            dispatch(changeAccessToken({
                              access_token: res.access_token
                            }))
                            console.log('access_token 만료되어 at 새로 발급받음 => access_token: ' + res.access_token);
                          }
                          else if(statusCode === 20009){
                            dispatch(changeBothToken({
                              access_token: res.access_token,
                              refresh_token: res.refresh_token
                            }))
                            console.log('refresh_token 기간이 만료직전이라 at, rt 새로 발급 => ' + res.access_token +' / ' + res.refresh_token);
                          }
                          else if(statusCode === 40009){
                            console.log('refresh_token 만료되어 재로그인 추천');
                            dispatch(changeLoginStatus(false))
                            dispatch(changeLoginToggle(true));
                            alert('로그인 후 사용할 수 있습니다.');
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