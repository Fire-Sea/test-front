import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import { Input } from '../Input';
import '../styles/Detail.css';
import useAxios from '../hooks/useAxios';

function Detail(){
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const ip = useSelector((state)=>{return state.ip});
  const [fade, setFade] = useState('');
  const {category, id} = useParams();
  const [textData, setTextData] = useState({
    category: '',
    textTitle: '',
    textBody: '',
    nickname: ''
  });
  const nickname = cookies.nickname;
  const [axiosGet] = useAxios(`http://${ip}/api/detail/?category=${category}&id=${id}`);


  // 글 정보 저장 함수
  const getData = async ()=>{
    try{
      const response = await axios.get(`http://${ip}/api/detail/?category=${category}&id=${id}`);
      let time = new Date(response.data.createdTime);
      response.data.createdTime = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDay()} ${time.getHours()}:${time.getSeconds()}`;
      setTextData(response.data);
    } 
    catch(e){
      console.log(e)
    }
  };

  // 글 삭제 요청 함수
  const deleteData = async ()=>{
    try{
      const response = await axios.delete(`http://${ip}/api/user/delete?id=${id}`);
      const statusCode = response.data.statusCode;
      if(statusCode === 20016){
        alert('정상적으로 삭제되었습니다.')
        navigate(-1);
      }
      else{
        alert('알수없는 이유로 실패했습니다.');
      }
    }
    catch(e){
      console.log(e);
    }
  }
  // 글 수정, 삭제 버튼 출력
  const showAdminBtn = ()=>{
    return(
      <>
      <button className='detail-modifyBtn' onClick={()=>{navigate(`/modify/${category}/${id}`)}}>글 수정하기</button>
      <button className='detail-removeBtn' onClick={deleteData}>글 삭제하기</button>
      </>
    )
  }
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
        </div>
        <div className='detail-info'>
          <p className='detail-nickname'>{textData.nickname}</p>
          <p>{textData.createdTime}</p>
          <p className='detail-cnt'>조회수: 123회</p>
        </div>
        <div className='detail-body' dangerouslySetInnerHTML={{__html: textData.textBody}}>
        </div>
        
        <div className='detail-btns'>
          <button className='detail-like detail-clicked'>좋아요</button>
          <button className='detail-dislike'>싫어요</button>
        </div>
        <button className='detail-backBtn' onClick={()=>navigate(-1)}>뒤로가기</button>
        {
          nickname === textData.nickname && showAdminBtn()
        }
    </div>
    </>
    )
  }

export {Detail};