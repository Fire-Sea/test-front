import { Routes, Route, useNavigate } from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import {Login} from './pages/Login';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Banner} from './Banner';
import { Gacha } from './pages/Gacha';
import './styles/App.css';
import { changeLoginStatus, changeNickname, changeDarkmode } from './store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function App() {

  let [easteregg, setEasteregg] = useState(false);
  const login_status = useSelector((state)=> {return state.loginInfo.login_status});
  return (
    <div className="App">
      {
        login_status && <Login/>
      }
      <Navbar/>
      {
        easteregg && <div className='easteregg'><h1>서버가~~일을~~안해~~~</h1></div>
      }

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
        <Route path="/list/:category/:currentPage" element={<Board/> } />
        <Route path="/detail/:category/:id" element={<Detail/>}/>
        <Route path="/edit/:category" element={<Edit/>}/>

        <Route path="/gacha" element={<Gacha/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

function Navbar(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = useSelector((state)=> {return state.loginInfo.nickname});
  let t = document.querySelector('body');
  const darkmode = cookies.darkmode;
  
  const loginBtn = (is_login)=>{
    if(is_login){
      return(
        <button className='login-toggle' onClick={()=>{
          removeCookie('is_login', {path: '/'});
          removeCookie('token', {path: '/'});
          alert('로그아웃 되었습니다.');
          window.location.replace('/');
        }}>로그아웃</button> 
      )
    }
    return(
      <button className='login-toggle' onClick={()=>{
        dispatch(changeLoginStatus(true));
      }}>로그인</button>
    )
  }
  
  const a = (dd)=>{
    if(darkmode == 'true'){
      t.classList.add('darkmode');
      t.style.color = 'white';
    }
    else{
      t.classList.remove('darkmode');
      t.style.color = 'black';
    }
  }
  
  return(
    <div className='header'>
      <div className='navbar'>
        <div className='navbar-l'>
          <p className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</p>
          <p className='navbar-item' onClick={()=>{
            navigate('/list/server/0');
            }}>Server</p>
          <p className='navbar-item' onClick={()=>{
            navigate('/list/front/0');
            }}>Front</p>
        </div>
        {
          a(darkmode)
        }
        {
          darkmode=='true' 
          ? <button onClick={()=>{
            dispatch(changeDarkmode(false)); 
            setCookie('darkmode', false, {path : '/'});

          }}>원상복귀시키기</button> 
          :<button onClick={()=>{
            dispatch(changeDarkmode(true));
            setCookie('darkmode', true, {path : '/'});

            // t.classList.add('darkmode');
            // document.querySelector('.navbar').style.backgroundColor = 'rgb(141, 45, 45)'
          }}>다크모드하기</button> 
        }
        <div className='navbar-r'>
          
          <div className='navbar-login'>
            <p className='login-icon'><FontAwesomeIcon icon={faUser} className='fa-2x'/></p>
            <div className='login-info'>
              <p>{nickname ? nickname : `로그인하세요`}</p>
              {loginBtn(cookies.is_login)}
            </div>
          </div>
        </div>
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
          <div className='img-overlay' onClick={()=>{navigate('/list/front/0')}}>Front</div>
          <img alt='main_img1' src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/list/server/0')}}>Server</div>
          <img alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        </div>
      </div>
      <div className={'main-game start' + fade}>
        <div className='img-overlay' onClick={()=>{navigate('/gacha')}}>Game</div>
        <img alt='main_img3' src={process.env.PUBLIC_URL + '/main_img3.jpg'}/>
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