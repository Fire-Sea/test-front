import './App.css';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import { useEffect, useState } from 'react';

function App() {
  let [login, setLogin] = useState(false);
  return (
    <div className="App">
      {
        login && <Login setLogin={setLogin}/>
      }
      <Navbar/>
      <button onClick={()=>{setLogin(true)}}>로그인</button>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} />}/>
        <Route path="/front/list/" element={<Board category={'Front'} />}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'}/>}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'}/>}/>

        <Route path="/register" element={<Register/>}/>

        <Route path="/:category/edit" element={<Edit/>}/>


        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

function Login({setLogin}){
  let navigate = useNavigate()
  return(
    <>
      <div className='login-bg'>
        <div className='login-logo'>
          <h1>Fire Sea</h1>
        </div>
        <div className='login-container'>
          <h1>로그인</h1>
          <p>아이디</p>
          <input className='login-id' type={'text'} placeholder='아이디'/>
          <p>비밀번호</p>
          <input className='login-passwd' type={'password'} placeholder='비밀번호'/>
          <div style={{'marginTop':'10px'}}></div>
          <button className='login-loginBtn' onClick={()=>{setLogin(false)}}>로그인</button>
          <button className='login-registerBtn' onClick={()=>{navigate('/register');setLogin(false) }}>회원가입</button>
        </div>
      </div>
    </>
  )
}

function Register(){
  return(
  <>
  <div className='register-container'>
    <h1>회원가입</h1>
    <p>이메일</p>
    <input className='register-email' type={'email'} placeholder='example@any.com' onChange={(e)=>{
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
    <input className='register-id' type={'text'} placeholder='아이디'/>
    <p>비밀번호</p>
    <input className='register-passwd' type={'password'} placeholder='비밀번호' onChange={(e)=>{
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
    <button className='register-registerBtn'>회원가입 하기</button>
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
