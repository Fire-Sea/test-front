import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useAuth from "./useAuth";

function useDelete(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id} = useParams();
  const [textData, setTextData] = useState({});
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const {silentRefresh} = useAuth();

  const axiosDeleteDetail = async ()=>{
    try{
      axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
      const res = await axios.delete(`http://${ip}/api/user/delete?id=${id}`);
      const statusCode = res.data.statusCode;
      if(statusCode === 20016){
        alert('정상적으로 삭제되었습니다.')
        navigate(-1);
      }
      else{
        silentRefresh();
      }
    }
    catch(e){
      console.log(e);
    }
  }
  return {axiosDeleteDetail}
}

export default useDelete;