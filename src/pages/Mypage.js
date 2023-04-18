import '../styles/Mypage.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useGetTextData from '../hooks/useGetTextData';

function Mypage(){
    const [cookies, setCookie] = useCookies();
    const {currentPage} = useParams();
    const [newNickname, setNewNickname] = useState('');
    const nickname = cookies.nickname;
    const [textList, setTextList] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalNum, setTotalNum] = useState(0);
    const ip = useSelector((state)=>{return state.ip});
    const navigate = useNavigate();
    const {getTextData} = useGetTextData();

    // 닉네임 변경 요청
    const changeNickname = async ()=>{
        if(newNickname){
            axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
            const response = await axios.get(`http://${ip}/api/user/changeNickname?newNickname=${newNickname}`);
            const statusCode = response.data.statusCode;
            if(statusCode === 20017){
              alert('성공적으로 변경되었습니다.');
              setCookie('nickname', newNickname, {
                path : '/',
              });
              navigate(-1);
            }
            else if(statusCode === 40017){
              alert('중복된 닉네임입니다.');
            }
            else{
              alert('서버와의 연결에 실패했습니다.')
            }
        }
        else{
          alert('변경할 닉네임을 입력해주세요');
        }
    }

    // input값 저장 함수
    const onChange = (e)=>{
      setNewNickname(e.target.value);
    }

    // 작성 글 페이지 표시 함수
    const addPageNum = (pageNum, currentPage)=>{
      const newArr = [];
      currentPage = parseInt(currentPage);
      
      for(let i=0; i<pageNum; i++){
        let template = '';
        if(i === currentPage){
          template = <button className='mypage-clicked' onClick={()=>navigate(`/mypage/${nickname}/${i}`)} key={i}>{i+1}</button>
        }
        else{
          template = <button className='mypage-pageNum' onClick={()=>navigate(`/mypage/${nickname}/${i}`)} key={i}>{i+1}</button>
        }
        newArr.push(template);
      }
      return newArr;
    }


  useEffect(()=>{
    (async ()=>{
      const data = await getTextData({parent: 'list', child: 'mypage'});
      setTextList(data.content);
      setTotalNum(data.totalElements);
      setTotalPage(data.totalPages);
    })()
  }, [currentPage])


  return(
      <div className="mypage-bg">
        <h1>회원 정보</h1>
        <div className='mypage-loginfo'>
          <h4>닉네임</h4>
          <input onChange={onChange}></input>
          <button className='mypage-change' onClick={changeNickname}>변경하기</button>
        </div>
        <div className='mypage-board'>
          <h4>작성한 글 개수</h4>
          <p className='mypage-textCnt'>{totalNum}개</p>
          {
            totalNum == 0
            ? <h1>작성된 글이 없습니다.</h1>
            :<><table className='board-pc'>
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>추천</th>
              </tr>
            </thead>
            <tbody>
              {
                textList.map((data, i)=>{
                  return(
                    <tr className='board-tr' onClick={()=>{navigate(`/detail/${data.category}/${data.id}/0`)}} key={i}>
                    <td className='board-id'>{totalNum-(currentPage*20)-i}</td>
                    <td className='mypage-category'>{data.category}</td>
                    <td className='board-title'>{data.textTitle}</td>
                    <td className='board-date'>{data.createdTime}</td>
                    <td className='board-views'>{data.views}</td>
                    <td className='board-likes'>{data.likes - data.dislikes}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <table className='board-m'>
            <tbody>
              {
                textList.map((data, i)=>{
                  return(
                    <tr className='board-tr-m' onClick={()=>{navigate(`/detail/${data.category}/${data.id}/0`)}} key={i}>
                      <td className='board-title-m' colSpan={2}>
                        <p className='p-title'>{data.textTitle}</p>
                        <p className='p-nickname'>{data.category}</p>
                        <p className='p-likes'>추천 {data.likes - data.dislikes}</p>
                        <p className='p-likes'>조회수 {data.views}</p>
                        <p className='p-views'>{data.createdTime}</p>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className='mypage-btns'>
            {
              addPageNum(totalPage, currentPage)
            }
          </div></>
          }
          
        </div>
      </div>
    )
}

export {Mypage}