import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { changeLoginStatus, changeNickname } from '../store';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function useSendUserInfo(data){
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});

  const sendUserInfo = async (type)=>{
    switch(type){
      case 'login':
        try{
          const res = await axios.post(`http://${ip}/api/login`, data);
          const code = res.data.statusCode;
          if(code === 40002){
            alert('로그인 정보가 일치하지 않습니다.');
          }
          else{
            console.log('2. 로그인 정보가 일치하여 access_token, refresh_token 발급');
    
            const nickname = res.data.data;
            const expires = new Date();
            expires.setMinutes(expires.getMinutes()+300);
    
            const token = {
              access_token: res.headers.access_token,
              refresh_token: res.headers.refresh_token
            };
            setCookie('token', token, {path: '/'});
            setCookie('nickname', nickname, {path: '/'});
            dispatch(changeNickname(nickname));
            dispatch(changeLoginStatus(false));
            alert('어서오세요!');
          }
        }
        catch(e){
          console.log(e)
          removeCookie('token', {path: '/'});
          removeCookie('nickname', {path: '/'});
          alert('서버와 연결이 원할하지 않습니다. 잠시후 다시 시도해주세요.');
        }
        break;

      case 'register':
        try{
          const res = await axios.post(`http://${ip}/api/register`, data);
          const code = res.data.statusCode;
          if(code !== 40001){
            alert('성공적으로 가입되었습니다.');
            navigate('/');
          }
        }
        catch(e){
          removeCookie('token', {path: '/'});
          removeCookie('nickname', {path: '/'});
          alert('서버와 연결이 원할하지 않습니다.');
        }
        break;
      default: break;
    }
  }
  return {sendUserInfo};
}
export default useSendUserInfo;