import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../components/Input';
import useGetTextData from '../hooks/useGetTextData';
import useCheckToken from '../hooks/useCheckToken';
import '../styles/Board.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { changeSearchContent, changeSearchFlag } from '../store';

function Board(){
  const navigate = useNavigate();
  const {category, currentPage, type} = useParams();
  const [textList, setTextList] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [fade, setFade] = useState('');
  const {checkToken} = useCheckToken();
  const {getTextData} = useGetTextData();
  const searchData = useSelector((state)=>{return state.searchData})
  const ip = useSelector((state)=>{return state.ip})
  const search = JSON.parse(localStorage.getItem('searchData'));

  // 게시판 페이지 표시 함수
  const addPageNum = (pageNum, currentPage)=>{
    const newArr = [];
    currentPage = parseInt(currentPage);
    for(let i=0; i<pageNum; i++){
      let template = '';
      if(i === currentPage){
        template = <button className='board-clicked' onClick={()=>navigate(`/list/${type}/${category}/${i}`)} key={i}>{i+1}</button>;
      }
      else{
        template = <button onClick={()=>navigate(`/list/${type}/${category}/${i}`)} key={i}>{i+1}</button>;
      }
      newArr.push(template);
    }
    return newArr;
  }

  useEffect(()=>{
    // 글 목록 GET
    if(type == 'board'){
      (async ()=>{
        const data = await getTextData({parent: 'list', child:'board'});
        setTextList(data.content);
        setTotalNum(data.totalElements);
        setTotalPage(data.totalPages);
      })()
    }
    else if(type == 'search'){
      (async ()=>{
        console.log('search data 요청중')
        console.log(searchData)
        let response;
        if(searchData.content == ''){
          response = await axios.post(`http://${ip}/api/search?page=0`, search)
        }
        else{
          response = await axios.post(`http://${ip}/api/search?page=0`, searchData);
        }
        const data = response.data
        setTextList(data.content);
        setTotalNum(data.totalElements);
        setTotalPage(data.totalPages);
        console.log(response);
      })()
    }
    
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [currentPage, category, searchData.flag])
  // 
  return(
    <>
    <Input/>
    <div className={'board-container start ' + fade}>
      {
        type == 'search' 
        ?
        <h2>'{search.content}' 검색결과 {totalNum}개</h2>
        : type == 'board'
          ? <h1>게시판</h1>
          : <h1>검색</h1>
      }
      <div className='board-box'>
      <h1 className='board-category' onClick={()=>navigate(`/list/board/${category}/0`)}>{category}</h1>
          {
            !totalNum ?
            <h1 style={{'textAlign' : 'center'}}>검색 결과가 없습니다.</h1>
            : <><table className='board-pc'>
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>추천</th>
              </tr>
            </thead>
            <tbody>
              {
                textList.map((data, i)=>{
                  return(
                    <tr className='board-tr' key={data.id}>
                      <td className='board-id'>{totalNum-(currentPage*20)-i}</td>
                      <td className='board-title' onClick={()=>navigate(`/detail/${category}/${data.id}/0`)}><a>{data.textTitle}</a></td>
                      <td className='board-nickname'>{data.nickname}</td>
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
                    <tr className='board-tr-m' key={data.id}>
                      <td className='board-title-m' colSpan={2} onClick={()=>navigate(`/detail/${category}/${data.id}/0`)}>
                        <p className='p-title'>{data.textTitle}</p>
                        <p className='p-nickname'>{data.nickname}</p>
                        <p className='p-likes'>추천 {data.likes - data.dislikes}</p>
                        <p className='p-likes'>조회수 {data.views}</p>
                        <p className='p-views'>{data.createdTime}</p>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table></>
          }
      
      </div>
      <div className='board-pages'>
        {
          addPageNum(totalPage, currentPage)
        }
      </div>
      <button className='board-home' onClick={()=>navigate('/')}>홈으로</button>
      <button className='board-new' onClick={checkToken}>글쓰기</button>
    </div>
    </>
  )
}

export {Board};