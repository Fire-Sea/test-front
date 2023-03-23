import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeLoginStatus, changeBothToken, changeLoginToggle } from '../store';
import axios from 'axios';

function Login(){
    let navigate = useNavigate();
    let [fade, setFade] = useState('');
    let ip = useSelector((state) => {return state.ip});
    let token = useSelector((state)=> {return state.token});
    let dispatch = useDispatch();
  
    useEffect(()=>{
      const fadeTimer = setTimeout(()=>{setFade('end')}, 100)
      return ()=>{
        clearTimeout(fadeTimer);
        setFade('')
      }
    }, [])
  
    // function onSilentRefresh(){
    //   axios.post('http://${ip}/api/refresh', loginData)
    //     .then(onLoginSuccess)
    //     .catch(err=>{console.log(err)})
    // }
  
    // function onLoginSuccess(response){
    //   const {accessToken} = response.data;
    //   axios.defaults.headers.common['Authorization'] = `${accessToken}`;
    //   setTimeout(onSilentRefresh, 600000);
    // }
    return(
      <>
        <div className={'login-bg start ' + fade}>
          <div className='login-logo'>
            <h1>Fire Sea</h1>
          </div>
          <div className='login-container'>
            <h1>로그인</h1>
            <p>아이디</p>
            <input className='login-id' id='loginId' type={'text'} placeholder='아이디'/>
            <p>비밀번호</p>
            <input className='login-passwd' id='loginPasswd' type={'password'} placeholder='비밀번호'/>
            <div style={{'marginTop':'10px'}}></div>
            <button className='login-loginBtn' onClick={()=>{     
              let loginId = document.querySelector('#loginId');
              let loginPasswd = document.querySelector('#loginPasswd');
              let username = loginId.value;
              let password = loginPasswd.value;
  
              if(!username || !password){
                alert('아이디 또는 비밀번호를 입력하세요.');
                loginId.style = 'border: 3px solid red';
                loginPasswd.style = 'border: 3px solid red';
              }
              else{
                const data = {
                  username: username,
                  password: password
                }
    
                axios.post(`http://${ip}/api/login`, data)
                  .then(res=>{
                    let statusCode = res.data.statusCode;
                    if(statusCode === 40002){
                      alert('아이디 또는 비밀번호가 틀렸습니다.');
                      loginId.style = 'border: 3px solid red';
                      loginPasswd.style = 'border: 3px solid red';
                    }
                    else{
                      res = res.headers;
                      dispatch(changeBothToken({
                        access_token: 'test1',//res.access_token,
                        refresh_token: 'test2'//res.refresh_token
                      }))
                      console.log('로그인에 성공했고 at, rt 모두 첫 발급받음 => access_token: ' + token.access_token +'/refresh_token: ' + token.refresh_token);
                      dispatch(changeLoginToggle(false));
                      dispatch(changeLoginStatus(true))
                      
                      alert('어서오세요!');
                    }
                  })
                  .catch(err=>{
                    console.log(err); 
                    alert('아이디 또는 비밀번호가 틀렸습니다.');
                    loginId.style = 'border: 3px solid red';
                    loginPasswd.style = 'border: 3px solid red';
                  });
              }
              
            }}>로그인</button>
            <span className='login-text'>회원이 아니신가요?</span>
            <button className='login-registerBtn' onClick={()=>{navigate('/register'); dispatch(changeLoginToggle(false));}}>회원가입 하기</button>
            <button className='login-cancelBtn' onClick={()=>{dispatch(changeLoginToggle(false))}}>닫기</button>
          </div>
        </div>
      </>
    )
  }

  export {Login};