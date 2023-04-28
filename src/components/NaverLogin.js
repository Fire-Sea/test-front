import { useEffect, useState } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeLoginStatus, changeNickname } from "../store";

function NaverLogin(){
  const {naver} = window;
  const NAVER_CLIENT_ID = '';
  const NAVER_CALLBACK_URL = 'http://localhost:3000';
  const ip = useSelector(state=>{return state.ip});
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    snsId: '',
    email: '',
    name: '',
  })
  const initializeNaverLogin = ()=>{
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: {color: 'green', type: 3, height: 45},
      callbackHandle: true,
    })
    naverLogin.init();

    naverLogin.getLoginStatus(async function(status){
      if(status){
        const userInfo = {
          snsId: naverLogin.user.getId(),
          email: naverLogin.user.getEmail(),
          name: naverLogin.user.getName(),
        }
        setUserInfo({
          ...userInfo,
        })
        localStorage.setItem('naverUserInfo', JSON.stringify(userInfo))
      }
    })
  }
  const userAccessToken = ()=>{
    // window.location.href.includes('access_token') && getToken();
    window.location.href.includes('access_token') && sendUserInfo();
  }
  const sendUserInfo = async ()=>{
    // const token = window.location.href.split('=')[1].split('&')[0];
    const response = await axios.post(`http://${ip}/api/oauth2`, userInfo);
    const statusCode = response.data.statusCode;
    console.log(response);
    localStorage.setItem('test', JSON.stringify(response));
    if(statusCode === 20031){
      console.log('첫방문, 회원가입이동')
    }
    else if(statusCode === 20032){
      console.log('DB에 계정이 존재함(로그인)')
      const nickname = response.data.data;
      const expires = new Date();
      expires.setMinutes(expires.getMinutes()+300);

      const token = {
        access_token: response.headers.access_token,
        refresh_token: response.headers.refresh_token
      };
      setCookie('token', token, {path: '/'});
      setCookie('nickname', nickname, {path: '/'});
      dispatch(changeNickname(nickname));
      dispatch(changeLoginStatus(false));
      alert('어서오세요!');
    }
  }
  useEffect(()=>{
  }, [])

  return(
    <>
      <div id='naverIdLogin' onClick={()=>{
        initializeNaverLogin();
        sendUserInfo();
      }}/>
    </>
  )
}

export {NaverLogin};