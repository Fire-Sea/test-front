import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { changeLoginStatus } from '../store';
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useSilentRefresh from "./useSilentRefresh";

function useCheckToken(){
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ip = useSelector((state) => {return state.ip});
  const {category} = useParams();
  const {silentRefresh} = useSilentRefresh();
  const nickname = cookies.nickname;

  // 토큰검사
  const checkToken = async (type)=>{
    if(nickname){
      let route = ``;
      if(type == 'mypage'){
        route = `/mypage/${nickname}/0`;
      }
      else{
        route = `/edit/${category}`;
      }
      try{
        axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
        axios.defaults.withCredentials = true;

        const res = await axios.get(`http://${ip}/api/user`);
        const statusCode = res.data.statusCode;
            
        // 1. access_token: 유효 / refresh_token: 5분이상 유효
        if(statusCode === 20011){
          console.log('1. access_token: 유효 / refresh_token: 5분이상 유효');
          navigate(route);
        }
        // 2. access_token: 만료
        //    refresh_token을 보내 access_token을 갱신시도
        else if(statusCode === 40006){
          console.log('2. access_token: 만료');
          console.log('   refresh_token을 보내 access_token을 갱신시도');
          const code = await silentRefresh();
          console.log(code)
          if(code != 0){
            navigate(route);
          }
        }
      }
      catch(e){
        console.log(e);
        alert('로그인이 필요한 서비스입니다.');
        dispatch(changeLoginStatus(true));
      }
    }
    else{
      console.log('3. access_token, refresh_token 없이 접근시도');
      console.log('   로그인 하도록 유도');
      alert('로그인이 필요한 서비스입니다.');
      dispatch(changeLoginStatus(true));
    }
  }
  return {checkToken};
}

export default useCheckToken;