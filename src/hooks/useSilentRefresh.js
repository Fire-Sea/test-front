import axios from 'axios'
import { changeLoginStatus } from '../store';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

function useSilentRefresh(){
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const ip = useSelector((state) => {return state.ip});

  const silentRefresh = async ()=>{
    try{
      console.log(cookies.token.refresh_token);
      axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;

      const res = await axios.get(`http://${ip}/api/refresh`);
      const statusCode = res.data.statusCode;

      const expires = new Date();
      expires.setMinutes(expires.getMinutes()+300);
      console.log('silent_refresh 시도중')

      // access_token 재발급
      console.log(statusCode)
      if(statusCode === 20010){
        console.log('1. refresh_token 정상 access_token만 재발급')
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
        console.log('2. refresh_token 5분미만 access_token와 함께 둘다 재발급')
        const token = {
          access_token: res.headers.access_token,
          refresh_token: res.headers.refresh_token,
        }
        setCookie('token', token, {expires: expires})
        return 1;
      }
      // 2-3. refresh_token: 만료
      //      재로그인 하도록 유도
      else if(statusCode === 40009){
        alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
        removeCookie('token', {path: '/'});
        removeCookie('nickname', {path: '/'});
        dispatch(changeLoginStatus(true));
        return 0;
      }
      // 2-4. 기타 토큰 문제
      else{
        alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
        removeCookie('token', {path: '/'});
        removeCookie('nickname', {path: '/'});
        dispatch(changeLoginStatus(true));
        return 0;
      }
    }
    catch(e){
      alert('로그인이 필요합니다.');
      dispatch(changeLoginStatus(true));
    }
  }
  return {silentRefresh};
}

export default useSilentRefresh;