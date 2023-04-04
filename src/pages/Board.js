import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Input } from '../Input';
import { changeLoginStatus } from '../store';
import '../styles/Board.css';

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
    }
    catch(e){
      setServerErr(true);
      console.log(e);
      alert('서버와 연결이 원할하지 않습니다. 잠시후 시도해주세요.');
    }
  }

  // 토큰 재요청 함수
  const silentRefresh = async ()=>{
    axios.defaults.headers.common['Authorization'] = cookies.token.refresh_token;
    const response = await axios.get(`http://${ip}/api/refresh`);
    const statusCode = response.data.statusCode;

    const expires = new Date();
    expires.setMinutes(expires.getMinutes()+300);

    if(statusCode === 20010){
      console.log('2-1. refresh_token: 5분이상 유효');
      console.log('     access_token 재발급 성공');

      const token = {
        access_token: response.access_token,
        refresh_token: cookies.token.refresh_token
      }
      setCookie('token', token, {
        expires: expires
      })
      navigate(`/edit/${category}`);
    }

    // 2-2. refresh_token: 5분미만 유효
    //      access_token, refresh_token 둘다 재발급 성공
    else if(statusCode === 20009){
      console.log('2-2. refresh_token: 5분미만 유효');
      console.log('     access_token, refresh_token 둘다 재발급 성공');
      const token = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      }
      setCookie('token', token, {
        expires: expires
      })
      navigate(`/edit/${category}`);
    }

    // 2-3. refresh_token: 만료
    //      재로그인 하도록 유도
    else if(statusCode === 40009){
      console.log('2-3. refresh_token: 만료');
      console.log('     재로그인 하도록 유도');
      alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
      removeCookie('token', {path: '/'});
      dispatch(changeLoginStatus(true));
    }

    // 2-4. 기타 네트워크 문제
    else{
      console.log('2-4. 기타 네트워크 문제');
      alert('서버와 통신이 원할하지 않습니다. 잠시후 시도해주세요');
    }
      // 2-4. 서버와의 연결문제로 statusCode 확인불가
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
          silentRefresh();
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
                <tr className='board-tr' key={data.id}>
                  <td className='board-id'>{totalNum-(currentPage*10)-i}</td>
                  <td className='board-title' onClick={()=>navigate(`/detail/${category}/${data.id}`)}><a>{data.textTitle}</a></td>
                  <td className='board-nickname'>{data.nickname}</td>
                  <td className='board-date'>{data.createdTime}</td>
                </tr>
              )
            })
          }  
          <tr><td className='board-line' colSpan={4}></td></tr>
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
                    <a className='a-date'>{data.createdTime}</a>
                  </td>
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