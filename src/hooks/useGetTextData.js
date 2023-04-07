import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

function useGetTextData(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id, currentPage} = useParams();
  const [textData, setTextData] = useState({});
  const [cookies] = useCookies();

  const getTextData = async (type)=>{
    switch(type.parent){
      case 'list':
        let url = ''
        if(type.child === 'mypage'){
          url = `http://${ip}/api/user/list`;
        }
        else if(type.child === 'board'){
          url = `http://${ip}/api/list?category=${category}&page=${currentPage}`;
        }
        try{
          const res = await axios.get(url);
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
        break;
      case 'detail':
        try{
          const res = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
          const data = res.data;
          let time = new Date(data.createdTime);
          data.createdTime = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDay()} ${time.getHours()}:${time.getSeconds()}`;
          return data;
        }
        catch(e){
          alert('서버와의 연결이 원할하지 않습니다.');
        }
        break;
      default:
        break;
    }
  }
  return {getTextData}
}

export default useGetTextData;