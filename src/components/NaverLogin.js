import { useEffect } from "react";

function NaverLogin({setGetToken, setUserInfo}){
  const {naver} = window;
  const NAVER_CLIENT_ID = 'cLChQ4ifVDQAeuQZcQGq';
  const NAVER_CALLBACK_URL = 'http://localhost:3000';
  const initializeNaverLogin = ()=>{
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: {color: 'green', type: 3, height: 40},
      callbackHandle: true,
    })
    naverLogin.init();

    naverLogin.getLoginStatus(async function(status){
      if(status){
        const userEmail = naverLogin.user.getEmail();
        const userName = naverLogin.user.getName();
        console.log(status)
        console.log(userEmail)
        console.log(userName)
      }
    })
  }

  const userAccessToken = ()=>{
    window.location.href.includes('access_token') && getToken();
  }
  const getToken = ()=>{
    const token = window.location.href.split('=')[1].split('&')[0];
    console.log(token)
  }

  useEffect(()=>{
    initializeNaverLogin();
    userAccessToken();
  }, [])

  return(
    <>
      <div id='naverIdLogin'/>
    </>
  )
}

export {NaverLogin};