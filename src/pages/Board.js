import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../Input';
import { changeLoginToggle } from '../store';
import axios from 'axios';
import '../styles/Board.css';
import { useCookies } from 'react-cookie';

function Board({category}){
  const [textList, setTextList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalNum, setTotalNum] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [serverErr, setServerErr] = useState(false);
  const [fade, setFade] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ip = useSelector((state)=>{return state.ip});
  const token = useSelector((state)=>{return state.token});
  const [cookies, setCookie, removeCookie] = useCookies();

  // 게시판 페이지 표시 함수
  const addPageNum = (pageNum, currentPage)=>{
    const newArr = [];
    for(let i=0; i<pageNum; i++){
      let template = '';
      if(i === currentPage){
        template = <button className='board-clicked' onClick={()=>setCurrentPage(i)} key={i}>{i+1}</button>;
      }
      else{
        template = <button onClick={()=>setCurrentPage(i)} key={i}>{i+1}</button>;
      }
      newArr.push(template);
    }
    return newArr;
  }

  // 게시판 글 목록 저장 함수
  const getTextList = ()=>{
    axios.get(`http://${ip}/api/list?category=${category}&page=${currentPage}`)
    .then(res=>{
      const data = res.data;
      setTextList(data.content);
      setTotalNum(data.totalElements);
      setTotalPage(data.totalPages);
      const now = new Date();

      data.content.forEach((a,i)=>{
        const date = new Date(a.createdTime);
        if(date > now){
          data.content[i].createdTime = date.toISOString().substring(11, 16)
        }
        else{
          data.content[i].createdTime = date.toISOString().substring(0, 10)
        }
      })
    })
    .catch((err)=>{
      setServerErr(true);
      console.log(err);
      alert('서버와 연결이 원할하지 않습니다. 잠시후 시도해주세요.');
    })
  }

  // 토큰 재요청 함수
  const silentRefresh =(cat)=>{
    const expires = new Date();
    expires.setMinutes(expires.getMinutes()+300);
    axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;
    axios.get(`http://${ip}/api/refresh`)
      .then(res=>{
        const statusCode = res.data.statusCode;
        res = res.headers;
        
        // 2-1. refresh_token: 5분이상 유효
        //      access_token 만 재발급 성공
        if(statusCode === 20010){

          console.log('2-1. refresh_token: 5분이상 유효');
          console.log('     access_token 재발급 성공');

          const token = {
            access_token: res.access_token,
            refresh_token: cookies.token.refresh_token
          }
          setCookie('token', token, {
            expires,
          })
          navigate(`/${cat}/edit`);
        }
        // 2-2. refresh_token: 5분미만 유효
        //      access_token, refresh_token 둘다 재발급 성공
        else if(statusCode === 20009){

          console.log('2-2. refresh_token: 5분미만 유효');
          console.log('     access_token, refresh_token 둘다 재발급 성공');
          const token = {
            access_token: res.access_token,
            refresh_token: res.refresh_token,
          }
          setCookie('token', token, {
            path: '/',
            expires,
          })
          navigate(`/${cat}/edit`);
        }
        // 2-3. refresh_token: 만료
        //      재로그인 하도록 유도
        else if(statusCode === 40009){
          console.log('2-3. refresh_token: 만료');
          console.log('     재로그인 하도록 유도');
          alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
          removeCookie('token');
          dispatch(changeLoginToggle(true));
        }
        // 2-4. 기타 네트워크 문제
        else{
          console.log('2-4. 기타 네트워크 문제');
          alert('서버와 통신이 원할하지 않습니다. 잠시후 시도해주세요');
        }
      })
      // 2-4. 서버와의 연결문제로 statusCode 확인불가
      .catch(err=>{
        console.log(err);
        alert('서버와의 통신이 원할하지 않습니다. 잠시후 시도해주세요');
      })
  }

  // access_token 유효성 검사 함수
  const checkToken = ()=>{
    if(cookies.is_login){
      try{
        axios.defaults.headers.common['Authorization'] = cookies.token.access_token;
        axios.defaults.withCredentials = true;

        axios.get(`http://${ip}/api/user`)
          .then(res=>{
            const statusCode = res.data.statusCode;
            const cat = category.toLowerCase();

            // 1. access_token: 유효 / refresh_token: 5분이상 유효
            if(statusCode === 20011){
              console.log('1. access_token: 유효 / refresh_token: 5분이상 유효');
              navigate(`/${cat}/edit`);
            }
            // 2. access_token: 만료
            //    refresh_token을 보내 access_token을 갱신시도
            else if(statusCode === 40006){
              console.log('2. access_token: 만료');
              console.log('   refresh_token을 보내 access_token을 갱신시도');
              silentRefresh(cat);
            }
          })
      }
      catch{
        alert('로그인이 필요한 서비스입니다.');
        dispatch(changeLoginToggle(true));
      }
    }
    else{
      console.log('3. access_token, refresh_token 없이 접근시도');
      console.log('   로그인 하도록 유도');
      alert('로그인이 필요한 서비스입니다.');
      dispatch(changeLoginToggle(true));
    }
  }

  useEffect(()=>{
    getTextList();
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
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            serverErr && <tr><td colSpan={3}><h1>서버가 일을 안해요</h1></td></tr> 
          }
          {
            textList.map((data, i)=>{
              return(
                <tr className='board-tr' key={i}>
                  <td className='board-id'>{totalNum-(currentPage*10)-i}</td>
                  <td className='board-title' onClick={()=>navigate(`/${category}/detail/${data.id}`)}><a>{data.textTitle}</a></td>
                  <td className='board-nickname'>{data.nickname}</td>
                  <td className='board-date'>{data.createdTime}</td>
                </tr>
              )
            })
          }  
          <tr><td className='board-line' colSpan={4}></td></tr>
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