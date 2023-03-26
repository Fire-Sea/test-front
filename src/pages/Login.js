import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeLoginToggle } from '../store';
import axios from 'axios';
import '../styles/Login.css';
import { useCookies } from 'react-cookie';

function Login(){
  const [fade, setFade] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const [cookies, setCookie] = useCookies();
  
  const getInputData = ()=>{
    const loginId = document.querySelector('#loginId');
    const loginPasswd = document.querySelector('#loginPasswd');
    const username = loginId.value;
    const password = loginPasswd.value;

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
      sendLoginData(data);
    }
  }

  const sendLoginData = (data)=>{
    const loginId = document.querySelector('#loginId');
    const loginPasswd = document.querySelector('#loginPasswd');
    
    axios.defaults.withCredentials = true;
    axios.post(`http://${ip}/api/login`, data)
      .then(res=>{
        const statusCode = res.data.statusCode;
        // 1. 로그인 정보가 일치하지 않음
        if(statusCode === 40002){
          alert('로그인 정보가 일치하지 않습니다.');
          loginId.style = 'border: 3px solid red';
          loginPasswd.style = 'border: 3px solid red';
        }
        // 2. 로그인 정보가 일치하면 access_token, refresh_token 발급
        else{
          const expires = new Date();
          expires.setMinutes(expires.getMinutes()+300);

          res = res.headers;
          const token = {
            access_token: res.access_token,
            refresh_token: res.refresh_token,
          };

          setCookie('token', token, {
            path: '/',
            expires,
          })
          setCookie('is_login', true, {
            path: '/',
            expires
          });
          dispatch(changeLoginToggle(false));
          alert('어서오세요!');
          console.log('2. 로그인 정보가 일치하여 access_token, refresh_token 발급');
        }
      })
      .catch(err=>{
        console.log(err); 
        alert('서버와의 통신이 원할하지 않습니다. 잠시후 시도해주세요.');
        loginId.style = 'border: 3px solid red';
        loginPasswd.style = 'border: 3px solid red';
      });
  }


  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100)
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])

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
          <input className='login-passwd' id='loginPasswd' type={'password'} onKeyUp={(e)=>{
            if(e.key == 'Enter'){
              e.preventDefault();
              document.querySelector('.login-loginBtn').click();
            }}} placeholder='비밀번호'/>
          <div style={{'marginTop':'10px'}}></div>
          <button className='login-loginBtn' onClick={()=>getInputData()}>로그인</button>
          <span className='login-text'>회원이 아니신가요?</span>
          <button className='login-registerBtn' onClick={()=>{navigate('/register'); dispatch(changeLoginToggle(false));}}>회원가입 하기</button>
          <button className='login-cancelBtn' onClick={()=>{dispatch(changeLoginToggle(false))}}>닫기</button>
        </div>
      </div>
    </>
  )
}

export {Login};


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