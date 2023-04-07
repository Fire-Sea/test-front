import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function usePost(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id} = useParams();
  const [textData, setTextData] = useState({});


  const axiosGetDetail = async ()=>{
    try{
      const res = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
      let time = new Date(res.data.createdTime);
      res.data.createdTime = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDay()} ${time.getHours()}:${time.getSeconds()}`;
      return res.data;
    }
    catch(e){
      alert('서버와의 연결이 원할하지 않습니다.');
    }
  }
  return {axiosGetDetail}
}

export default usePost;