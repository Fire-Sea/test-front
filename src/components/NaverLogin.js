import { useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

function NaverLogin({setGetToken, setUserInfo}){
  const {naver} = window;
  const NAVER_CLIENT_ID = '';
  const NAVER_CALLBACK_URL = 'http://localhost:3000';
  const ip = useSelector(state=>{return state.ip});
  const [cookies, setCookie, removeCookie] = useCookies();
  const nickname = cookies.nickname;

  const initializeNaverLogin = ()=>{
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: {color: 'green', type: 3, height: 40},
      callbackHandle: true,
    })
    naverLogin.init();

    // naverLogin.getLoginStatus(async function(status){
    //   if(status){
    //     const userEmail = naverLogin.user.getEmail();
    //     const userName = naverLogin.user.getName();
    //     console.log(status)
    //     console.log(userEmail)
    //     console.log(userName)
    //   }
    // })
  }

  const userAccessToken = ()=>{
    window.location.href.includes('access_token') && getToken();
    window.location.href.includes('access_token') && sendToken();
  }
  const getToken = ()=>{
    const token = window.location.href.split('=')[1].split('&')[0];
    console.log(token)
  }
  const sendToken = async ()=>{
    const token = window.location.href.split('=')[1].split('&')[0];
    const response = await axios.get(`http://${ip}/api/oauth2?access_token=${token}`);
    const statusCode = response.data.statusCode;
    console.log(statusCode);
    if(statusCode === 20031){
      console.log('최초로그인')
    }
    else if(statusCode === 20032){
      console.log('로그인성공')
    }
  }
  useEffect(()=>{
    initializeNaverLogin();
    if(nickname){

    }
    else{
      userAccessToken();
    }
  }, [])

  return(
    <>
      <div id='naverIdLogin'/>
    </>
  )
}

export {NaverLogin};