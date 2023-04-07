import { useState } from "react";
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { changeLoginStatus, changeNickname } from '../store';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function useAuth(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});

  const sendLoginData = async ()=>{
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
        setCookie('token', token, {path: '/', expires});
        setCookie('nickname', nickname, {path: '/', expires});
        dispatch(changeNickname(nickname));
        dispatch(changeLoginStatus(false));
        alert('어서오세요!');
      }
    }
    catch(e){
      alert('서버와 연결이 원할하지 않습니다.');
    }
  };

  const sendRegisterData = async ()=>{
    try{
      const res = await axios.post(`http://${ip}/api/register`, data);
      const code = res.data.statusCode;
      console.log(res);
      if(code !== 40001){
        alert('성공적으로 가입되었습니다.');
        navigate('/');
      }
    }
    catch(e){
      alert('서버와 연결이 원할하지 않습니다.');
    }
  }
  
  const silentRefresh = async ()=>{
    try{
      axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;
      const res = await axios.get(`http://${ip}/api/refresh`);
      const statusCode = res.data.statusCode;

      const expires = new Date();
      expires.setMinutes(expires.getMinutes()+300);
      console.log('silent_refresh 시도중')
      // access_token 재발급
      if(statusCode === 20010){
        console.log('access_token 재발급')
        const token = {
          access_token: res.headers.access_token,
          refresh_token: cookies.token.refresh_token
        }
        setCookie('token', token, {expires: expires})
        return 1;
      }

      // 2-2. refresh_token: 5분미만 유효
      //      access_token, refresh_token 둘다 재발급 성공
      else if(statusCode === 20009){
        console.log('둘다 재발급')
        const token = {
          access_token: res.headers.access_token,
          refresh_token: res.headers.refresh_token,
        }
        setCookie('token', token, {
          expires: expires
        })
        return 1;
      }

      // 2-3. refresh_token: 만료
      //      재로그인 하도록 유도
      else if(statusCode === 40009){
        alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
        removeCookie('token', {path: '/'});
        dispatch(changeLoginStatus(true));
        return 0;
      }
      // 2-4. 기타 네트워크 문제
      else{
        alert('서버와 연결이 원할하지 않습니다.');
        return 0;
      }
    }
    catch(e){
      alert('서버와 연결이 원할하지 않습니다.');
    }
  }
  return {response, sendLoginData, sendRegisterData, silentRefresh}
}

export default useAuth;