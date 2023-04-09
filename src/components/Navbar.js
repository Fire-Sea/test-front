import { changeLoginStatus } from '../store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useCheckToken from '../hooks/useCheckToken';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css'

function Navbar(){
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = cookies.nickname;
  const localSettingTheme = localStorage.getItem('theme');
  const {checkToken} = useCheckToken();

  const loginBtn = (nickname)=>{
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
      <div className={styles['navbar']}>
        <div className={styles['navbar-left']}>
          <ul className={styles['navbar-logo']} onClick={()=>navigate('/')}><h1>Fire Sea</h1></ul>
          <ul className={styles['navbar-item']}>게시판</ul>
          <ul className={styles['navbar-item']}>게임</ul>
          {/* <p className={styles.navbar_item} onClick={()=>navigate('/list/server/0')}>Server</p>
          <p className={styles.navbar_item} onClick={()=>navigate('/list/front/0')}>Front</p> */}
        </div>
        <div className={styles['navbar-right']}>
          <p className={styles['navbar-icon']}><FontAwesomeIcon icon={faUser} className='fa-2x' onClick={goMypage}/></p>
          <div className={styles['login-box']}>
            <p className={styles['login-nickname']}>{nickname ? nickname : `로그인하세요`}</p>
            {loginBtn(cookies.nickname)}
          </div>
        </div>
      </div>
    </div>
  )
}

export {Navbar};