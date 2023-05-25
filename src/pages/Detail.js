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
import useSilentRefresh from '../hooks/useSilentRefresh';

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
  const [modifyComment, setModifyComment] = useState({
    commentId: '',
    commentBody: ''
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
  const {silentRefresh} = useSilentRefresh();
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
      <div className={'detail-box box-' + isDark}>
        <h1 className='detail-category' onClick={()=>navigate(`/list/board/${category}/0`)}>{category}</h1>
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

        </div>
        <div className='comment-container'>
          {
            totalCnt != null
            ?
            commentList.map((data, i)=>{
              return(
                <li key={i}>
                  <div className='comment-l'>
                  <h4 className='comment-nickname'>{data.nickname}</h4>
                  {
                    nickname == data.nickname
                    &&  <div className='comment-modify'>
                          <p>{`${data.createdTime.substr(0,10)} ${data.createdTime.substr(11)}`}</p>
                          <p onClick={(e)=>{
                            const childrens = e.target.parentNode.parentNode.children
                            childrens[3].style.display = 'block';
                            childrens[2].style.display = 'none';
                          }}>수정</p>
                          <p onClick={(e)=>{
                            (async ()=>{
                              axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
                              const response = await axios.delete(`http://${ip}/api/user/comment/delete`, {
                                headers: {"Content-Type": "application/json"},
                                data: JSON.stringify({commentId: data.commentId})
                              });
                              if(response.data.statusCode != 20027){
                                silentRefresh();
                              }
                              else{
                                alert('삭제되었습니다.')
                                await getList();
                              }
                            })()
                          }}>삭제</p>
                        </div>
                  }
                  <p className='comment-body'>{data.commentBody}</p>
                  {
                    nickname == data.nickname
                    && <div className='comment-input'>
                        <textarea className='comment-textarea' value={data.commentBody} onChange={(e)=>{
                          const value = e.target.value;
                          setModifyComment({
                            ...modifyComment,
                            ['commentId'] : data.commentId,
                            ['commentBody'] : value
                          })
                          let copy = [...commentList]
                          copy[i] = {
                            ...copy[i],
                            ['commentBody'] : value
                          }
                          setCommentList(copy)
                        }}></textarea>
                        <button className='comment-cancelmodify' onClick={(e)=>{
                          const childrens = e.target.parentNode.parentNode.children;
                          childrens[3].style.display = 'none'
                          childrens[2].style.display = 'block'
                        }}>X</button>
                        <button className='comment-modifybtn' onClick={(e)=>{
                          const childrens = e.target.parentNode.parentNode.children;
                          (async ()=>{
                            axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
                            const response = await axios.patch(`http://${ip}/api/user/comment/update`, modifyComment);
                            if(response.data.statusCode != 20026){
                              silentRefresh();
                            }
                            else{
                              alert('수정되었습니다.')
                              await getList();
                            }
                          })()
                          childrens[3].style.display = 'none'
                          childrens[2].style.display = 'block'
                        }}>수정하기</button>
                      </div>
                  }
                  </div>
                </li>
              )
            })
            : null
          }
        <button className={'detail-backBtn'} onClick={()=>navigate(-1)}>뒤로가기</button>
        {
          nickname === textData.nickname && showAdminBtn()
        }
      </div>
    </div>
    </>
    )
  }

export {Detail};