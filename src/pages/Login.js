import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeLoginStatus, changeNickname } from '../store';
import axios from 'axios';
import '../styles/Login.css';
import { useCookies } from 'react-cookie';

function Login(){
  const [fade, setFade] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const [cookies, setCookie] = useCookies();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const {username, password} = loginData;

  // 각 input에서 username, password 저장
  const onChange = (e)=>{
    const {name, value} = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    })
  }

  // input null값 검사
  const checkValue = ()=>{
    if(!username || !password){
      alert('아이디 또는 비밀번호를 입력하세요.');
    }
    else{
      postData();
    }
  }

  // 로그인 정보를 POST
  const postData = async ()=>{
    try{
      const response = await axios.post(`http://${ip}/api/login`, loginData);
      const statusCode = response.data.statusCode;
      
      if(statusCode === 40002){
        alert('로그인 정보가 일치하지 않습니다.');
      }
      else{
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+300);
        const nickname = response.data.data;

        const token = {
          access_token: response.headers.access_token,
          refresh_token: response.headers.refresh_token
        };
        setCookie('token', token, {
          path: '/',
          expires,
        })
        setCookie('is_login', true, {
          path: '/',
          expires
        });
        setCookie('nickname', nickname,{
          path: '/',
          expires
        })
        dispatch(changeNickname(nickname));
        dispatch(changeLoginStatus(false));
        alert('어서오세요!');
        
        console.log('2. 로그인 정보가 일치하여 access_token, refresh_token 발급');
      }
    } catch(e){
      console.log('서버와의 통신이 원할하지 않습니다. 잠시후 재시도해주세요.');
    }
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
          <input className='login-id' id='loginId' type={'text'} placeholder='아이디' onChange={onChange} name='username' value={username}/>
          <p>비밀번호</p>
          <input className='login-passwd' id='loginPasswd' type={'password'} onChange={onChange} name='password' value={password}
           onKeyUp={(e)=>{
            if(e.key == 'Enter'){
              e.preventDefault();
              document.querySelector('.login-loginBtn').click();
            }}} placeholder='비밀번호'/>
          <div style={{'marginTop':'10px'}}></div>
          <button className='login-loginBtn' onClick={checkValue}>로그인</button>
          <span className='login-text'>회원이 아니신가요?</span>
          <button className='login-registerBtn' onClick={()=>{navigate('/register'); dispatch(changeLoginStatus(false));}}>회원가입 하기</button>
          <button className='login-cancelBtn' onClick={()=>{dispatch(changeLoginStatus(false))}}>닫기</button>
        </div>
      </div>
    </>
  )
}

export {Login};