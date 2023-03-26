import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Input } from '../Input';
import {useSelector} from 'react-redux';
import { useRef } from 'react';
import axios from 'axios';
import '../styles/Detail.css';

function Detail({category}){
  const [textData, setTextData] = useState({});
  const [fade, setFade] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  const ip = useSelector((state)=>{return state.ip});
  const textDetail = useRef(null);

  
  // 글 정보 저장 함수
  const getTextData = ()=>{
    axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`)
    .then(res=>{
      let time = new Date(res.data.createdTime);
      time = time.toISOString();
      res.data.createdTime = `${time.substring(0, 10)} ${time.substring(11, 19)}`;
      setTextData(res.data);
      textDetail.current.innerHTML = res.data.textBody;
    })
    .catch(err=>{
      console.log(err);
      alert('서버와 연결이 원할하지 않습니다. 잠시후 시도해주세요.');
    })
  }

  useEffect(()=>{
    getTextData();
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
        <div className='detail-body' ref={textDetail}></div>
        <button className='detail-backBtn' onClick={()=>navigate(-1)}>뒤로가기</button>
    </div>
    </>
    )
  }

export {Detail};