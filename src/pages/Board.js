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
  const localSearchData = JSON.parse(localStorage.getItem('searchData'));
  const reg = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;

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
        let response;
        if(searchData.content == ''){
          response = await axios.post(`http://${ip}/api/search?page=0`, localSearchData);
        }
        else{
          response = await axios.post(`http://${ip}/api/search?page=0`, searchData);
        }
        const data = response.data
        const now = new Date();
        const today = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`);

        data.content.forEach((a,i)=>{
          const date = new Date(a.createdTime);
          if(date > today){
            a.createdTime = date.toString().substring(16, 21);
          }
          else{
            a.createdTime = date.toISOString().substring(0, 10)
          }
        })
        setTextList(data.content);
        setTotalNum(data.totalElements);
        setTotalPage(data.totalPages);
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
        <h2>'{localSearchData.content}' 검색결과 {totalNum}개</h2>
        : <h1 className='board-type'>게시판</h1>
      }
      <div className='board-box'>
          {
            type == 'search'
            ? !totalNum ?
            <h1 style={{'textAlign' : 'center'}}>검색 결과가 없습니다.</h1>
            : <>
            <h1 className='board-category'>{category}</h1>
            <table className='board-pc'>
            <thead>
              <tr>
                <th>No</th>
                <th className='th-title'>제목</th>
                <th className='th-nickname'>작성자</th>
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
                      <td className='board-title' onClick={()=>navigate(`/detail/${category}/${data.id}/0`)}>
                        <div className='board-title-div'>
                          {
                            localSearchData.option == 'textMessage' 
                            ? <a>{data.textTitle.split(localSearchData.content.replace(reg, ''))[0]} 
                                <span style={{'background':'yellow', 'color':'black'}}>
                                  {localSearchData.content.replace(reg, '')}</span>  
                              {data.textTitle.split(localSearchData.content.replace(reg, ''))[1]}</a>
                            : <a>{data.textTitle}</a>
                          }
                        </div>
                      </td>
                      <td className='board-nickname'>{
                        localSearchData.option == 'nickname' 
                        ? <a>{data.nickname.split(localSearchData.content.replace(reg, ''))[0]} 
                            <span style={{'background':'yellow', 'color':'black'}}>{localSearchData.content.replace(reg, '')}</span>  
                          {data.nickname.split(localSearchData.content.replace(reg, ''))[1]}</a>
                        : <a>{data.nickname}</a>
                      }</td>
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
                        <p className='p-title'>
                          <span className='p-title-div'>
                            {
                              localSearchData.option == 'textMessage'
                              ? <span>{data.textTitle.split(localSearchData.content.replace(reg, ''))[0]}
                                <span style={{'background' : 'yellow', 'color': 'black'}}>{localSearchData.content.replace(reg, '')}</span>
                                {data.textTitle.split(localSearchData.content.replace(reg, ''))[1]}</span>
                              : <span>{data.textTitle}</span>
                            }
                          </span>
                        </p>
                        <p className='p-nickname'>
                          {
                            localSearchData.option == 'nickname'
                            ? <span>{data.nickname.split(localSearchData.content.replace(reg, ''))[0]}
                              <span style={{'background' : 'yellow', 'color': 'black'}}>{localSearchData.content.replace(reg, '')}</span>
                              {data.nickname.split(localSearchData.content.replace(reg, ''))[1]}</span>
                            : <span>{data.nickname}</span>
                          }</p>
                        <p className='p-likes'>추천 {data.likes - data.dislikes}</p>
                        <p className='p-views'>조회수 {data.views}</p>
                        <p className='p-date'>{data.createdTime}</p>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          </>
          : <>
          <h1 className='board-category' onClick={()=>navigate(`/list/board/${category}/0`)}>{category}</h1>
          <table className='board-pc'>
          <thead>
            <tr>
              <th>No</th>
              <th className='th-title'>제목</th>
              <th className='th-nickname'>작성자</th>
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
                    <td className='board-title' onClick={()=>navigate(`/detail/${category}/${data.id}/0`)}>
                      <div className='board-title-div'>
                        {data.textTitle}
                      </div>  
                    </td>
                    <td className='board-nickname'>
                      <div className='board-nickname-div'>
                        {data.nickname}
                      </div>
                    </td>
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
                      <p className='p-title'>
                        <span className='p-title-div'>
                          {data.textTitle}
                        </span>
                      </p>
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
        </table>
        </>
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