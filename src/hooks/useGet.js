import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function useGet(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id, currentPage} = useParams();
  const [textData, setTextData] = useState({});


  const axiosGetTextList = async ()=>{
    try{
      const res = await axios.get(`http://${ip}/api/list?category=${category}&page=${currentPage}`);
      const data = res.data;
      const now = new Date();
      const today = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`);

      data.content.forEach((a,i)=>{
        const date = new Date(a.createdTime);
        if(date > today){
          a.createdTime = date.toString().substring(16, 21);
        }
        else{
          a.createdTime = date.toISOString().substring(0, 10)
        }
      })
      return data;
    }
    catch(e){
      console.log(e);
      alert('서버와 연결이 원할하지 않습니다. 잠시후 시도해주세요.');
    }
  }

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
  return {axiosGetTextList, axiosGetDetail}
}

export default useGet;