import { changeLoginStatus } from '../store';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useCheckToken from '../hooks/useCheckToken';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
      checkToken('mypage');
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

export {Navbar};