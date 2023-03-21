import './App.css';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import { useEffect, useState } from 'react';

function App() {
  let [login, setLogin] = useState(false);
  let [loginInfo, setLoginInfo] = useState('');
  let [token , setToken] = useState({});

  let ip = '172.30.1.31:8080';

  return (
    <div className="App">
      {
        login && <Login setLogin={setLogin} loginInfo={loginInfo} setLoginInfo={setLoginInfo} ip={ip} token={token} setToken={setToken}/>
      }
      <Navbar/>
      <button onClick={()=>{setLogin(true)}}>로그인</button>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} ip={ip} loginInfo={loginInfo} />}/>
        <Route path="/front/list/" element={<Board category={'Front'} ip={ip} loginInfo={loginInfo}/>}/>
        <Route path="/detail/:id" element={<Detail ip={ip}/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'} ip={ip}/>}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'} ip={ip}/>}/>

        <Route path="/register" element={<Register ip={ip}/>}/>

        <Route path="/:category/edit" element={<Edit ip={ip} loginInfo={loginInfo}/>}/>


        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

function Login({setLogin, loginInfo, setLoginInfo, ip, token, setToken}){
  let navigate = useNavigate()

  // function onSilentRefresh(){
  //   fetch(`http://172.30.1.31:8080/api/silent-refresh`,{
  //     method: "POST",
  //     headers:{
  //       'content-type' : 'application/json',
  //       'Authorization' : `Bearer ${token}`
  //     }
  //   })
  // }
  // let onLoginSuccess = response=>{
  //   const {accessToken} = response.data;
  //   setToken(accessToken);
  //   setTimeout(onSilentRefresh, 50000);
  // }

  return(
    <>
      <div className='login-bg'>
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
            // setLogin(false)
            
            let username = document.querySelector('#loginId').value;
            let password = document.querySelector('#loginPasswd').value;
            
            fetch(`http://${ip}/api/login`, {
              method: "POST",
              headers:{
                "content-type" : "application/json",
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            })
              .then(res=>res.json())
              .then(res=>{
                console.log(res);
                if(res.statusCode == 40002){
                  alert('err');
                }
                else{
                  alert('로그인 성공'); 
                  setLogin(false); 
                  setLoginInfo(res.data);
                  console.log(res);
                  navigate('/');
                }
                // onLoginSuccess();
              })
              .catch(err=>{console.log(err); alert('로그인 실패');});

          }}>로그인</button>
          <button className='login-registerBtn' onClick={()=>{navigate('/register');setLogin(false) }}>회원가입</button>
        </div>
      </div>
    </>
  )
}

function Register({ip}){
  let navigate = useNavigate();
  let idValidChk = 0;
  return(
  <>
  <div className='register-container'>
    <h1>회원가입</h1>
    <p>이메일</p>
    <input className='register-email' id='registerEmail' type={'email'} placeholder='example@any.com' onChange={(e)=>{
      let value = e.currentTarget.value;
      let warning = document.querySelector('#email-chk');
      if(!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)){
        warning.innerHTML = '올바른 이메일 형식이 아닙니다.'
      }
      else{
        warning.innerHTML = ' '
      }
    }}/>
    <p id='email-chk'></p>
    <p>아이디</p>
    <input className='register-id' id='registerId' type={'text'} placeholder='아이디'/>
    <button onClick={()=>{
      let username = document.querySelector('#registerId').value;
      fetch(`http://${ip}/api/idCheck?username=${username}`)
      .then(res=>res.json())
      .then(res=>{
        if(res.statusCode == 20003){
          alert('사용 가능한 아이디입니다.');
          idValidChk = 1;
        }
        else if(res.statusCode = 40003){
          alert('해당 아이디는 이미 사용중입니다.');
          idValidChk = 0;
        }
        else{
          alert('서버가 일을 안해요');
        }
      })
        //20003 40003 -> 20004 40004
    }}>중복체크 {idValidChk}</button>
    <p>비밀번호</p>
    <input className='register-passwd' id='registerPasswd' type={'password'} placeholder='비밀번호' onChange={(e)=>{
      let value = e.currentTarget.value;
      let warning = document.querySelector('#passwd-chk');
      if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value)){
        warning.innerHTML = '비밀번호는 최소 8자리이며 특수문자를 포함해야 합니다.'
      }
      else{
        warning.innerHTML = ' '
      }
    }}/>
    <p id='passwd-chk'></p>
    <p>닉네임</p>
    <input className='register-id' id='registerNickname' type={'text'} placeholder='닉네임'/>
    <button onClick={()=>{
      let nickname = document.querySelector('#registerNickname').value;
      fetch(`http://${ip}/api/nicknameCheck?nickname=${nickname}`)
      .then(res=>res.json())
      .then(res=>{
        if(res.statusCode == 20004){
          alert('사용 가능한 닉네임입니다.');
          idValidChk = 1;
        }
        else if(res.statusCode = 40004){
          alert('해당 닉네임은 이미 사용중입니다.');
          idValidChk = 0;
        }
        else{
          alert('서버가 일을 안해요');
        }
      })
        //20003 40003 -> 20004 40004
    }}>중복체크 {idValidChk}</button>
    <button className='register-registerBtn' onClick={()=>{
      let email = document.querySelector('#registerEmail').value;
      let username = document.querySelector('#registerId').value;
      let password = document.querySelector('#registerPasswd').value;
      let nickname = document.querySelector('#registerNickname').value;
      let [chkUsername, chkNickname] = [false, false];

      fetch(`http://${ip}/api/register`, {
        method: "POST",
        headers:{
          "content-type" : "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          nickname: nickname
        })
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.statusCode == 40001){
            alert(data.responseMessage);
          }
          else{
            alert('성공적으로 회원가입 되었습니다.');
            navigate('/');
          }
        })
        .catch(err=>console.log(err));
      console.log(`id: ${username} / email: ${email} / passwd: ${password} / nickname: ${nickname}`);
    }}>회원가입 하기</button>
  </div>
  </>
  )
}
function Navbar(){
  let navigate = useNavigate();
  return(
    <div className='header'>
      <div className='navbar'>
        <a className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</a>
        <a className='navbar-item' onClick={()=>{navigate('/server/list')}}>Server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front/list')}}>Front</a>
      </div>
    </div>
  )
}



function Main(){
  let navigate = useNavigate();

  return(
    <>
      <Input/>
      <div className='main'>
        <div className='main-img'>
          <div className='img-overlay' onClick={()=>{
            navigate('/front/list');
            }}>Front</div>
          <img src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list')}}>Server</div>
          <img src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        </div>
      </div>

    </>
  )
}

function Error(){

  return(
    <div>err</div>
  )
}

// post api : :8080/api/send textTitle textBody




export default App;
