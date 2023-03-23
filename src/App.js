import { Routes, Route, useNavigate, Router } from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {Banner} from './Banner';
import './styles/App.css';
import { changeLoginStatus, changeBothToken, changeLoginToggle } from './store';

function App() {

  let [easteregg, setEasteregg] = useState(false);
  let token = useSelector((state)=> {return state.token});
  let dispatch = useDispatch();
  return (
    <div className="App">
      {
        token.login_toggle && <Login/>
      }
      <Navbar/>
        
      {
        token.login_status ? 
          <button onClick={()=>{
            dispatch(changeLoginStatus(false));
          }}>로그아웃</button> 
          : 
          <button onClick={()=>{
            dispatch(changeLoginToggle(true));
          }}>로그인</button>
      }



      {
        easteregg && <div className='easteregg'><h1>서버가~~일을~~안해~~~</h1></div>
      }

      <button onClick={()=>{
        console.log(`(at/rt/login_status)=> ${token.access_token}/${token.refresh_token}/${token.login_status}`);
      }}>현재 토큰, 로그인상황 콘솔</button>


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
      <Banner/>

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} />}/>
        <Route path="/front/list/" element={<Board category={'Front'} />}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'} />}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'} />}/>

        <Route path="/register" element={<Register/>}/>

        <Route path="/:category/edit" element={<Edit/>}/>

        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

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