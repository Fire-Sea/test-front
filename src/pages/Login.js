import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changeLoginStatus } from '../store';
import '../styles/Login.css';
import useSendUserInfo from '../hooks/useSendUserInfo';
import { NaverLogin } from '../components/NaverLogin';

function Login(){
  const [fade, setFade] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const localSettingTheme = localStorage.getItem('theme');
  const {username, password} = loginData;


  // 로그인 정보 POST하는 hook
  const {sendUserInfo} = useSendUserInfo(loginData);
  
  
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
      sendUserInfo('login');
    }
  }

  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])

  return(
    <>
      <div className={'login-bg start ' + fade + ' '+localSettingTheme}>
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
          <NaverLogin/>
          <button className='login-cancelBtn' onClick={()=>{dispatch(changeLoginStatus(false))}}>닫기</button>
        </div>
      </div>
    </>
  )
}

export {Login};