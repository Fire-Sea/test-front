import { useState } from "react";
import axios from 'axios'

function useAxios(url){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const axiosGet = async ()=>{
    try{
      const response = await axios.get(url);
      setResponse(response);
    }
    catch(e){
      alert('서버와의 연결이 원할하지 않습니다.');
    }
  }

  const axiosPost = async ()=>{
    try{
      const response = await axios.post(url);

    }
    catch(e){
      alert('서버와의 연결이 원할하지 않습니다.');
    }
  }
  return [ axiosGet]
}

export default useAxios;