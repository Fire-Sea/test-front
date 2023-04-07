import { useState } from "react";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { changeLoginStatus } from "../store";
import useSilentRefresh from "./useSilentRefresh";

function usePostDetail(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id} = useParams();
  const [textData, setTextData] = useState({});
  const {silentRefresh} = useSilentRefresh();
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postDetail = async (type)=>{
    if(cookies.nickname){
      try{
        let res = {};
        axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
        axios.defaults.withCredentials = true;

        if(cookies.token === undefined){
          console.log('0. 쿠키에 저장된 토큰이 없음');
          console.log('   로그인 하도록 유도');
          alert('로그인하세요.');
          return dispatch(changeLoginStatus(true));
        }
        if(id){
          res = await axios.patch(`http://${ip}/api/user/update?id=${id}`, data);
        }
        else{
          res = await axios.post(`http://${ip}/api/user/send`, data);
        }
        const statusCode = res.data.statusCode;
        console.log(statusCode)
        if(statusCode === 20000){
          alert('글이 저장되었습니다.');
          navigate(`/list/${category}/0`);
        }
        else if(statusCode === 20015){
          alert('정상적으로 수정되었습니다.');
          navigate(`/list/${category}/0`);
        }
        else{
          const code = await silentRefresh();
          console.log(code)
          if(code != 0){
            postDetail(data);
          }
        }
      }
      catch(e){
        alert('서버와의 연결이 원할하지 않습니다.');
      }
    }
    else{
      console.log('3. access_token, refresh_token 없이 접근시도');
      console.log('   로그인 하도록 유도');
      alert('로그인이 필요한 서비스입니다.');
      dispatch(changeLoginStatus(true));
    }
  }
  return {postDetail}
}

export default usePostDetail;