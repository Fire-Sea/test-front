import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

function useControlLikes(data){
  const [response, setResponse] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state)=>{return state.ip});
  const {category, id, currentPage} = useParams();
  const [textData, setTextData] = useState({});
  const [cookies] = useCookies();

  const controlLikes = async (type)=>{
    let [postUrl, getUrl] = ``;
    switch(type){
      case 'likes':
        postUrl = `http://${ip}/api/likeTm?id=${id}`;
        getUrl = `http://${ip}/api/countTmLikes?id=${id}`;
        break;
      case 'dislikes':
        postUrl = `http://${ip}/api/dislikeTm?id=${id}`;
        getUrl = `http://${ip}/api/countTmDislikes?id=${id}`;
        break;
      default:
        break;
    }
    try{
      const res = await axios.get(postUrl);
      if(res.data.statusCode === 40018){
        alert('이미 평가하셨습니다.')
      }
      else{
        const res = await axios.get(getUrl);
        return res.data.data;
      }
    }
    catch(e){
      console.log(e);
    }
  }
  return {controlLikes}
}

export default useControlLikes;