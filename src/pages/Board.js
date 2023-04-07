import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Input } from '../Input';
import { changeLoginStatus } from '../store';
import '../styles/Board.css';
import useAuth from '../hooks/useAuth';

function Board(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {category, currentPage} = useParams();
  const ip = useSelector((state)=>{return state.ip});
  const [cookies, setCookie, removeCookie] = useCookies();
  const [textList, setTextList] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [serverErr, setServerErr] = useState(false);
  const [fade, setFade] = useState('');
  const {silentRefresh} = useAuth();

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

  // 게시판 글 목록 저장 함수
  const getData = async ()=>{
    try{
      const response = await axios.get(`http://${ip}/api/list?category=${category}&page=${currentPage}`);
      const data = response.data;
      const now = new Date();
      const today = new Date(`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`);

      setTextList(data.content);
      setTotalNum(data.totalElements);
      setTotalPage(data.totalPages);
      data.content.forEach((a,i)=>{
        const date = new Date(a.createdTime);
        if(date > today){
          a.createdTime = date.toString().substring(16, 21);
        }
        else{
          a.createdTime = date.toISOString().substring(0, 10)
        }
        
      })
      console.log(data)
    }
    catch(e){
      setServerErr(true);
      console.log(e);
      alert('서버와 연결이 원할하지 않습니다. 잠시후 시도해주세요.');
    }
  }

  

  // access_token 유효성 검사 함수
  const checkToken = async ()=>{
    if(cookies.nickname){
      try{
        axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
        axios.defaults.withCredentials = true;

        const response = await axios.get(`http://${ip}/api/user`);
        const statusCode = response.data.statusCode;
            
        // 1. access_token: 유효 / refresh_token: 5분이상 유효
        if(statusCode === 20011){
          console.log('1. access_token: 유효 / refresh_token: 5분이상 유효');
          navigate(`/edit/${category}`);
        }
        // 2. access_token: 만료
        //    refresh_token을 보내 access_token을 갱신시도
        else if(statusCode === 40006){
          console.log('2. access_token: 만료');
          console.log('   refresh_token을 보내 access_token을 갱신시도');
          const code = silentRefresh();
          if(code){
            navigate(`/edit/${category}`);
          }
        }
      }
      catch{
        alert('로그인이 필요한 서비스입니다.');
        dispatch(changeLoginStatus(true));
      }
    }
    else{
      console.log('3. access_token, refresh_token 없이 접근시도');
      console.log('   로그인 하도록 유도');
      alert('로그인이 필요한 서비스입니다.');
      dispatch(changeLoginStatus(true));
    }
  }

  useEffect(()=>{
    getData();
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
          </tr>
        </thead>
        <tbody>
          {
            serverErr && <tr><td colSpan={3}><h1>서버가 일을 안해요</h1></td></tr> 
          }
          {
            textList.map((data, i)=>{
              return(
                <tr className='board-tr' key={data.id}>
                  <td className='board-id'>{totalNum-(currentPage*20)-i}</td>
                  <td className='board-title' onClick={()=>navigate(`/detail/${category}/${data.id}`)}><a>{data.textTitle}</a></td>
                  <td className='board-nickname'>{data.nickname}</td>
                  <td className='board-date'>{data.createdTime}</td>
                  <td className='board-views'>{data.views}</td>
                </tr>
              )
            })
          }  
          <tr><td className='board-line' colSpan={5}></td></tr>
        </tbody>
      </table>

      <table className='board-m'>
        <tbody>
          {
            textList.map((data, i)=>{
              return(
                <tr className='board-tr-m' key={data.id}>
                  <td className='board-title-m' colSpan={2} onClick={()=>navigate(`/detail/${category}/${data.id}`)}>
                    <a className='a-title'>{data.textTitle}</a>
                    <a className='a-nickname'>{data.nickname}</a>
                    <a className='a-views'>조회수 {data.views}</a>
                    <a className='a-date'>{data.createdTime}</a>
                  </td>
                </tr>
              )
            })
          }  
          <tr><td className='board-line' colSpan={5}></td></tr>
        </tbody>
      </table>
      <div className='board-pages'>
        {
          addPageNum(totalPage, currentPage)
        }
      </div>
      <button className='board-homeBtn' onClick={()=>navigate('/')}>홈으로</button>
      <button className='board-newBtn' onClick={()=>checkToken()}>글쓰기</button>
    </div>
    </>
  )
}

export {Board};