import { Routes, Route, useNavigate, Router } from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Banner} from './Banner';
import './styles/App.css';
import { changeAccessToken, changeToken } from './store';

function App() {
  let [login, setLogin] = useState(false);
  let [loginInfo, setLoginInfo] = useState('');
  
  let [loginData, setLoginData] = useState('');
  let [easteregg, setEasteregg] = useState(false);

  let [t, setT] = useState({});
  return (
    <div className="App">
      {
        login && <Login setLogin={setLogin} loginInfo={loginInfo} setLoginInfo={setLoginInfo} t={t} setT={setT}
        loginData={loginData} setLoginData={setLoginData}/>
      }
      <Navbar/>
      <button onClick={()=>{
        let t = document.querySelectorAll('.navbar a');
        if(!easteregg){
          document.querySelector('body').style = 'animation: bodyanime infinite 3s;'; 
          
          t.forEach((a)=>{
            a.style = 'animation: barrelroll 1s infinite;';
          }) 
          setEasteregg(true);
        }
        else{
          document.querySelector('body').style = '';
          t.forEach((a)=>{
            a.style = '';
          }) 
          setEasteregg(false);
        }
      }}>easteregg</button>
        
      {
        !loginData && <button onClick={()=>{setLogin(true)}}>로그인</button>
      }
      {
        loginData && <button>로그아웃</button>
      }
      {
        easteregg && <div className='easteregg'><h1>서버가~~일을~~안해~~~</h1></div>
      }
      <Banner/>

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} t={t}/>}/>
        <Route path="/front/list/" element={<Board category={'Front'} t={t} />}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'} />}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'} />}/>

        <Route path="/register" element={<Register/>}/>

        <Route path="/:category/edit" element={<Edit t={t} />}/>

        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

function Login({setLogin, setLoginInfo, setLoginData, loginData, t, setT}){
  let navigate = useNavigate();
  let [fade, setFade] = useState('');
  let ip = useSelector((state) => {return state.ip});
  let token = useSelector((state)=> {return state.token});

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
            let username = document.querySelector('#loginId').value;
            let password = document.querySelector('#loginPasswd').value;
            
            const data = {
              username: username,
              password: password
            }
            axios.post(`http://${ip}/api/login`, data)
              .then(res=>{
                res = res.headers;
                setT({
                  access_token: res.access_token,
                  refresh_token: res.refresh_token
                });
                console.log(t);
              })
              .catch(err=>{console.log(err); alert('로그인 실패');});
          }}>로그인</button>
          <span className='login-text'>회원이 아니신가요?</span>
          <button className='login-registerBtn' onClick={()=>{navigate('/register');setLogin(false) }}>회원가입 하기</button>
          <button className='login-cancelBtn' onClick={()=>{setLogin(false)}}>닫기</button>
        </div>
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
        <a className='navbar-item' onClick={()=>{navigate('/server/lisㄴt')}}>Server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front/list')}}>Front</a>
      </div>
    </div>
  )
}



function Main(){
  let navigate = useNavigate();
  let [fade, setFade] = useState('');

  useEffect(()=>{
    const fadeTimer = setTimeout(()=>{setFade('end')}, 100);

    return()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])
  return(
    <>
      <Input/>
      <div className={'main start ' + fade}>
        <div className='main-img'>
          <div className='img-overlay' onClick={()=>{navigate('/front/list')}}>Front</div>
          <img alt='main_img1' src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list')}}>Server</div>
          <img alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
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


export default App;