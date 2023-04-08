import { useCookies } from "react-cookie";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import useSilentRefresh from "./useSilentRefresh";
import { changeLoginStatus } from "../store";

function usePostComment(comment){
  const dispatch = useDispatch();
  const [cookies] = useCookies();
  const {silentRefresh} = useSilentRefresh();
  const ip = useSelector(state=>state.ip);


  const postComment = async ()=>{
    if(cookies.nickname){
      axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
      const res = await axios.post(`http://${ip}/api/user/comment/send`,comment);
      if(res.data.statusCode === 20021){
        alert('저장됨');
      }
      else{
        const code = await silentRefresh();
        if(code != 0){
          postComment();
        }
      }
    }
    else{
      alert('로그인이 필요한 서비스입니다.');
      dispatch(changeLoginStatus(true));
    }
  }
  return {postComment};
}

export default usePostComment;