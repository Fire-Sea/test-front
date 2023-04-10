import { changeLoginStatus, changeMenuStatus } from '../store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useCheckToken from '../hooks/useCheckToken';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'
import { useState } from 'react';

function Navbar(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = cookies.nickname;
  const isDark = localStorage.getItem('theme');
  const {checkToken} = useCheckToken();
  const [iconState, setIconState] = useState({t:false, m:false, b:false});
  const menuStatus = useSelector(state=>{return state.menuStatus});

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
        <button className={styles['login-btn']} onClick={()=>{
          removeCookie('token', {path: '/'});
          removeCookie('nickname', {path: '/'})
          alert('로그아웃 되었습니다.');
          window.location.replace('/');
        }}>로그아웃</button>
      )
    }
    return(
      <button className={styles['login-btn']} onClick={()=>{
        dispatch(changeLoginStatus(true));
      }}>로그인</button>
    )
  }
  const goMypage = async ()=>{
    if(!nickname){
      alert('로그인을 먼저 해주세요');
    }
    else{
      checkToken('mypage');
    }
  }
  return(
    <div className={styles['header']}>
      <div className={`${styles['navbar']} ${styles['navbar-'+isDark]}`}>
        <div className={styles['navbar-left']}>
          <ul className={styles['navbar-menu']} onClick={toggleSidebar}>
            <div className={`${styles['menu-t']} ${styles[iconState.t]}`}></div>
            <div className={`${styles['menu-m']} ${styles[iconState.m]}`}></div>
            <div className={`${styles['menu-b']} ${styles[iconState.b]}`}></div>
          </ul>
          <ul className={styles['navbar-logo']} onClick={()=>navigate('/')}><h1>Fire Sea</h1></ul>
        </div>
        <div className={styles['navbar-right']}>
          <p className={styles['navbar-icon']}><FontAwesomeIcon icon={faUser} className='fa-2x' onClick={goMypage}/></p>
          <div className={styles['login-box']}>
            <p className={styles['login-nickname']}>{nickname ? nickname : `로그인하세요`}</p>
            {toggleLogin(cookies.nickname)}
          </div>
        </div>
      </div>
      <div className={`${styles['sidebar']} ${styles[menuStatus]} ${styles['sidebar-'+isDark]}` }>
        <div className={styles['sidebar-box']}>
          <ul className={styles['sidebar-title']}>
            <h3>게시판</h3>
            <ul onClick={()=>navigate('/list/front/0')}><p>Front 게시판</p></ul>
            <ul onClick={()=>navigate('/list/server/0')}><p>Server 게시판</p></ul>
          </ul>
          <ul className={styles['sidebar-title']}>
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