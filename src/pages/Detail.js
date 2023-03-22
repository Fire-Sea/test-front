import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Input } from '../Input';
import { useParams } from "react-router-dom";
import axios from 'axios';
import {useSelector} from 'react-redux';

function Detail({category}){
    let ip = useSelector((state) => {return state.ip});
    let {id} = useParams();
    let [textData, setTextData] = useState({});
    let navigate = useNavigate();

    useEffect(()=>{
      axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`)
      .then(res=>{
        let time = new Date(res.data.createdTime);
        res.data.createdTime = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        setTextData(res.data);
      })
      .catch(err=>console.log(err))
    
    }, [])

    return(
      <>
        <Input/>
        <div className='detail-container'>
            <h1 className='detail-category'>{category}</h1>
            <div className='detail-title'>
                <h3>{textData.textTitle}</h3>
                <p>{textData.createdTime}</p>
            </div>
            <div className='detail-body'>
                <textarea value={textData.textBody} disabled/>
            </div>
            <button className='detail-backBtn' onClick={()=>{navigate(-1)}}>뒤로가기</button>
        </div>
      </>
    )
  }

  export {Detail};