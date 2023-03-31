import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Input } from '../Input';
import {useSelector} from 'react-redux';
import { useRef } from 'react';
import axios from 'axios';
import '../styles/Detail.css';

function Detail(){
  const [textData, setTextData] = useState({
    category: '',
    textTitle: '',
    textBody: ''
  });

  const [fade, setFade] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const ip = useSelector((state)=>{return state.ip});
  const textDetail = useRef(null);
  const {category} = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // 글 정보 저장 함수
  const getData = async ()=>{
    try{
      setErr(null);
      setLoading(true);
      
      const response = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
      let time = new Date(response.data.createdTime);
      time = time.toISOString();
      response.data.createdTime = `${time.substring(0, 10)} ${time.substring(11, 19)}`;
      setTextData(response.data);
    } catch(e){
      setErr(e);
    }
    setLoading(false);
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