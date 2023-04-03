import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useSelector} from 'react-redux';
import axios from 'axios';
import { Input } from '../Input';
import '../styles/Detail.css';

function Detail(){
  const navigate = useNavigate();
  const ip = useSelector((state)=>{return state.ip});
  const [fade, setFade] = useState('');
  const {category, id} = useParams();
  const [textData, setTextData] = useState({
    category: '',
    textTitle: '',
    textBody: ''
  });
  
  // 글 정보 저장 함수
  const getData = async ()=>{
    try{
      const response = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
      let time = new Date(response.data.createdTime);
      time = time.toISOString();
      response.data.createdTime = `${time.substring(0, 10)} ${time.substring(11, 19)}`;
      setTextData(response.data);
    } 
    catch(e){
      console.log(e)
    }
  };

  useEffect(()=>{
    getData();
    const fadeTimer = setTimeout(()=>{setFade('end')}, 100)
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
    }, [])

  return(
    <>
    <Input/>
    <div className={'detail-container start ' + fade}>
        <h1 className='detail-category'>{category}</h1>
        <div className='detail-title'>
            <h3>{textData.textTitle}</h3>
            <p>{textData.createdTime}</p>
        </div>
        <div className='detail-body' dangerouslySetInnerHTML={{__html: textData.textBody}}>
        </div>
        <button className='detail-backBtn' onClick={()=>navigate(-1)}>뒤로가기</button>
    </div>
    </>
    )
  }

export {Detail};