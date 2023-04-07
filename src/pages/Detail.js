import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import { Input } from '../Input';
import '../styles/Detail.css';
import useGetTextData from '../hooks/useGetTextData';
import useDelete from '../hooks/useDeleteDetail';
import useControlLikes from '../hooks/useControlLikes';

function Detail(){
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [fade, setFade] = useState('');
  const {category, id} = useParams();
  const [textData, setTextData] = useState({
    category: '',
    textTitle: '',
    textBody: '',
    nickname: '',
    views: 0,
    likes: 0,
    dislikes: 0
  });
  const nickname = cookies.nickname;
  const {getTextData} = useGetTextData();
  const {deleteDetail} = useDelete();
  const ip = useSelector(state=>state.ip);
  const {controlLikes} = useControlLikes();

  // 글 수정, 삭제 버튼 출력
  const showAdminBtn = ()=>{
    return(
      <>
      <button className='detail-modifyBtn' onClick={()=>{navigate(`/modify/${category}/${id}`)}}>글 수정하기</button>
      <button className='detail-removeBtn' onClick={deleteDetail}>글 삭제하기</button>
      </>
    )
  }

  // 좋아요 추가 및 상태변경
  const chagngeLikes = async (type)=>{
    let test = await controlLikes(type);
    if(test){
      setTextData({
        ...textData,
        [type]: test
      })
    }
  }

  useEffect(()=>{
    // 글 정보 GET
    (async ()=>{
      const data = await getTextData({parent: 'detail'});
      setTextData(data);
    })();
    
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
          <p className='detail-cnt'>조회수: {textData.views}</p>
        </div>
        <div className='detail-body' dangerouslySetInnerHTML={{__html: textData.textBody}}>
        </div>
        
        <div className='detail-btns'>
          <button className='detail-like' onClick={()=>{chagngeLikes('likes')}}><h3>{textData.likes}</h3><p>좋아요</p></button>
          <button className='detail-dislike' onClick={()=>{chagngeLikes('dislikes')}}><h3>{textData.dislikes}</h3><p>싫어요</p></button>
        </div>
        {
          nickname === textData.nickname && showAdminBtn()
        }
        <button className='detail-backBtn' onClick={()=>navigate(-1)}>뒤로가기</button>
    </div>
    </>
    )
  }

export {Detail};