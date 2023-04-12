import { changeLoginStatus, changeMenuStatus } from '../store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useCheckToken from '../hooks/useCheckToken';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'
import { useState } from 'react';
import { useTheme } from '../theme/useTheme';

function Navbar(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = cookies.nickname;
  const {checkToken} = useCheckToken();
  const [iconState, setIconState] = useState({t:false, m:false, b:false});
  const menuStatus = useSelector(state=>{return state.menuStatus});

  const [themeMode, toggleTheme] = useTheme();
  const isDark = themeMode;

  const toggleSidebar = ()=>{
    if(menuStatus){
      dispatch(changeMenuStatus(false));
      setIconState(false);
    }
    else{
      dispatch(changeMenuStatus('sidebar-t'));
      setIconState({
        t: 'menu-t-t',
        m: 'menu-m-t',
        b: 'menu-b-t'
      })
    }
  }
  const toggleLogin = (nickname)=>{
    if(nickname){
      return(
        <button className='login-btn' onClick={()=>{
          removeCookie('token', {path: '/'});
          removeCookie('nickname', {path: '/'})
          alert('로그아웃 되었습니다.');
          window.location.replace('/');
        }}>로그아웃</button>
      )
    }
    return(
      <button className='login-btn' onClick={()=>{
        dispatch(changeLoginStatus(true));
      }}>로그인</button>
    )
  }
  const goMypage = async ()=>{
    if(!nickname){
      alert('로그인을 먼저 해주세요');
      dispatch(changeLoginStatus(true));
    }
    else{
      checkToken('mypage');
    }
  }
  return(
    <div className='header'>
      <div className={'navbar navbar-'+isDark}>
        <div className='navbar-left'>
          <ul className='navbar-menu' onClick={toggleSidebar}>
            <div className={'menu-t ' +iconState.t}></div>
            <div className={'menu-m ' +iconState.m}></div>
            <div className={'menu-b ' +iconState.b}></div>
          </ul>
          <ul className='navbar-logo' onClick={()=>navigate('/')}><h1>Fire Sea</h1></ul>
        </div>
        <div className='navbar-right'>
          <p className='navbar-icon'><FontAwesomeIcon icon={faUser} className='fa-2x' onClick={goMypage}/></p>
          <div className='login-box'>
            <p className='login-nickname'>{nickname ? nickname : `로그인하세요`}</p>
            {toggleLogin(cookies.nickname)}
          </div>
        </div>
      </div>
      <div className={'sidebar ' + menuStatus + ' sidebar-'+isDark}>
        <div className='sidebar-box'>
          <ul className='sidebar-title'>
            <h3>게시판</h3>
            <ul onClick={()=>navigate('/list/front/0')}><p>Front 게시판</p></ul>
            <ul onClick={()=>navigate('/list/server/0')}><p>Server 게시판</p></ul>
          </ul>
          <ul className='sidebar-title'>
            <h3>게임하기</h3>
            <ul><p>게임1</p></ul>
            <ul><p>게임2</p></ul>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {Navbar};