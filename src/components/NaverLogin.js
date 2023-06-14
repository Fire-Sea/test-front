import { useEffect, useState } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeLoginStatus, changeNickname } from "../store";

function NaverLogin(){
  const {naver} = window;
  const NAVER_CLIENT_ID = '';
  const NAVER_CALLBACK_URL = 'http://192.168.0.6:3000';
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
      loginButton: {color: 'white', type: 1, height: 30},
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
  // 토큰이 검출되면 서버로 토큰 전송
  const userAccessToken = ()=>{
    // window.location.href.includes('access_token') && getToken();
    window.location.href.includes('access_token') && sendUserInfo();
  }
  
  // 서버로 토큰 전송
  const sendUserInfo = async ()=>{
    const userInfo = JSON.parse(localStorage.getItem('naverUserInfo'));
    const response = await axios.post(`http://${ip}/api/oauth2`, userInfo);
    const statusCode = response.data.statusCode;
    console.log(response);
    if(statusCode === 20031){
      console.log('첫방문, 회원가입이동')
      alert('연동된 아이디가 없습니다. 회원가입 해주세요.')
      navigate('/sns')
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
    initializeNaverLogin();
    userAccessToken();
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