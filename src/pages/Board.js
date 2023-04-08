import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../Input';
import '../styles/Board.css';
import useGetTextData from '../hooks/useGetTextData';
import useCheckToken from '../hooks/useCheckToken';

function Board(){
  const navigate = useNavigate();
  const {category, currentPage} = useParams();
  const [textList, setTextList] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [fade, setFade] = useState('');
  const {checkToken} = useCheckToken();
  const {getTextData} = useGetTextData();

  // 게시판 페이지 표시 함수
  const addPageNum = (pageNum, currentPage)=>{
    const newArr = [];
    currentPage = parseInt(currentPage);
    
    for(let i=0; i<pageNum; i++){
      let template = '';
      if(i === currentPage){
        template = <button className='board-clicked' onClick={()=>navigate(`/list/${category}/${i}`)} key={i}>{i+1}</button>;
      }
      else{
        template = <button onClick={()=>navigate(`/list/${category}/${i}`)} key={i}>{i+1}</button>;
      }
      newArr.push(template);
    }
    return newArr;
  }

  useEffect(()=>{
    // 글 목록 GET
    (async ()=>{
      const data = await getTextData({parent: 'list', child:'board'});
      setTextList(data.content);
      setTotalNum(data.totalElements);
      setTotalPage(data.totalPages);
    })()
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [currentPage, category])

  return(
    <>
    <Input/>
    <div className={'board start ' + fade}>
      <h1 className='board-category'>{category}</h1>
      <table className='board-pc'>
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
          <tr><td className='board-line' colSpan={6}></td></tr>
        </tbody>
      </table>

      <table className='board-m'>
        <tbody>
          {
            textList.map((data, i)=>{
              return(
                <tr className='board-tr-m' key={data.id}>
                  <td className='board-title-m' colSpan={2} onClick={()=>navigate(`/detail/${category}/${data.id}/0`)}>
                    <a className='a-title'>{data.textTitle}</a>
                    <a className='a-nickname'>{data.nickname}</a>
                    <a className='a-views'>조회수 {data.views}</a>
                    <a className='a-date'>{data.createdTime}</a>
                  </td>
                </tr>
              )
            })
          }  
          <tr><td className='board-line' colSpan={6}></td></tr>
        </tbody>
      </table>
      <div className='board-pages'>
        {
          addPageNum(totalPage, currentPage)
        }
      </div>
      <button className='board-homeBtn' onClick={()=>navigate('/')}>홈으로</button>
      <button className='board-newBtn' onClick={checkToken}>글쓰기</button>
    </div>
    </>
  )
}

export {Board};