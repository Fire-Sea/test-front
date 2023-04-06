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
import { changeLoginStatus } from './store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styled, { ThemeProvider } from 'styled-components';
import {dark, light} from './theme/theme';
import { useTheme } from './theme/useTheme';
import {Mypage} from './pages/Mypage';

function App() {
  const [themeMode, toggleTheme] = useTheme();
  const theme = themeMode === 'light' ? light : dark;
  const login_status = useSelector((state)=> {return state.loginInfo.login_status});
  return (
    <ThemeProvider theme={theme}>
      <S.Main>
    <div className="App">
      {
        login_status && <Login/>
      }
      <Navbar/>
      <button onClick={toggleTheme}>헤헤</button>
      <Banner/>

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/list/:category/:currentPage" element={<Board/> } />
        <Route path="/detail/:category/:id" element={<Detail/>}/>
        <Route path="/modify/:category/:id" element={<Edit/>}/>
        <Route path="/edit/:category" element={<Edit/>}/>
      
        <Route path="/mypage/:nickname/:currentPage" element={<Mypage/>}/>
        <Route path="/gacha" element={<Gacha/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
    </S.Main>
    </ThemeProvider>
  );
}

function Navbar(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = cookies.nickname;
  const localSettingTheme = localStorage.getItem('theme');
  
  const loginBtn = (nickname)=>{
    if(nickname){
      return(
        <button className='login-toggle' onClick={()=>{
          removeCookie('token', {path: '/'});
          removeCookie('nickname', {path: '/'})
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
  const goMypage = async ()=>{
    if(!nickname){
      alert('로그인을 먼저 해주세요');
    }
    else{
      navigate(`/mypage/${nickname}/0`)
    }
  }
  return(
    <div className='header'>
      <div className={'navbar navbar-' + localSettingTheme}>
        <div className='navbar-l'>
          <p className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</p>
          <p className='navbar-item' onClick={()=>{
            navigate('/list/server/0');
            }}>Server</p>
          <p className='navbar-item' onClick={()=>{
            navigate('/list/front/0');
            }}>Front</p>
        </div>
        <div className='navbar-r'>
          <div className='navbar-login'>
            <p className='login-icon'><FontAwesomeIcon icon={faUser} className='fa-2x' onClick={goMypage}/></p>
            <div className='login-info'>
              <p>{nickname ? nickname : `로그인하세요`}</p>
              {loginBtn(cookies.nickname)}
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

const S = {};
S.Main = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.bgColor};
  color: ${props => props.theme.colors.titleColor}
`;