import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import { Input } from '../components/Input';
import '../styles/Detail.css';
import useGetTextData from '../hooks/useGetTextData';
import useDelete from '../hooks/useDeleteDetail';
import useControlLikes from '../hooks/useControlLikes';
import usePostComment from '../hooks/usePostComment';

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
  const [comment, setComment] = useState({
    commentBody: '',
    id: 0
  })

  const [commentList, setCommentList] = useState({
    nickname: '',
    commentBody: ''
  })
  const nickname = cookies.nickname;
  const {getTextData} = useGetTextData();
  const {deleteDetail} = useDelete();
  const ip = useSelector(state=>state.ip);
  const {controlLikes} = useControlLikes();
  
  const {postComment} = usePostComment(comment);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCnt, setTotalCnt] = useState(null);
  const isDark = localStorage.getItem('theme')
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
  const changeComment = (e)=>{
    const comment = e.currentTarget.value;
    setComment({
      commentBody: comment,
      id: id
    })
  }
  const chkComment = async (e)=>{
    if(comment.commentBody !== ''){
      await postComment();
      await getList();
    }
    else{
      alert('댓글 내용을 입력해주세요.');
    }
  }
  const getList = async ()=>{
    const res = await axios.get(`http://${ip}/api/comment/list?id=${id}&page=${currentPage}`);
    console.log(res)
    setCommentList(res.data.data.content);
    setTotalCnt(res.data.data.totalElements);
  }
  useEffect(()=>{
    // 글 정보 GET
    (async ()=>{
      const data = await getTextData({parent: 'detail'});
      setTextData(data);
    })();
    getList();
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
        <div className='detail-comment'>
          <textarea className={'detail-input detail-' + isDark} onInput={changeComment} placeholder='댓글을 입력하세요.'></textarea>
          <button className='detail-savecomment' onClick={chkComment}>댓글 저장하기</button>
        </div>

        <div className='comment-container'>
          {
            totalCnt != null
            ?
            commentList.map((data, i)=>{
              return(
                <li key={i}><h4>{data.nickname}</h4><p>{data.commentBody}</p></li>
              )
            })
            : null
          }
        </div>
        <button className={'detail-backBtn'} onClick={()=>navigate(-1)}>뒤로가기</button>
        {
          nickname === textData.nickname && showAdminBtn()
        }
    </div>
    </>
    )
  }

export {Detail};