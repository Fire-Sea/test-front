import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../Input';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import '../styles/Board.css';
import { changeAccessToken, changeBothToken, changeLoginStatus, changeLoginToggle } from '../store';

function Board({category}){
    let [textList, setTextList] = useState([]);
    let navigate = useNavigate();
    let [currentPage, setCurrentPage] = useState(0);
    let [totalNum, setTotalNum] = useState(0);
    let [totalPage, setTotalPage] = useState(0);
    let [serverErr, setServerErr] = useState(false);

    let ip = useSelector((state) => {return state.ip})
    let token = useSelector((state)=> {return state.token});
    let dispatch = useDispatch();

    let [fade, setFade] = useState('');

    const addPageNum = (pageNum, currentPage)=>{
      const newArr = [];
      for(let i=0; i<pageNum; i++){
        let template = '';
        if(i === currentPage){
          template = <button className='board-clicked' onClick={()=>{
            setCurrentPage(i);
          }} key={i}>{i+1}</button>;
        }
        else{
          template = <button onClick={()=>{setCurrentPage(i);}} key={i}>{i+1}</button>;
        }
        newArr.push(template);
      }
      return newArr;
    }

    const silentRefresh =()=>{
      let cat = 'front';
      axios.defaults.headers.common['Authorization'] = token.refresh_token;
      axios.get(`http://${ip}/api/refresh`)
        .then(res=>{
          let statusCode = res.data.statusCode;
          res = res.headers;
          
          // 2-1. refresh_token: 5분이상 유효
          //      access_token 만 재발급 성공
          if(statusCode === 20010){
            console.log('2-1. refresh_token: 5분이상 유효');
            console.log('     access_token 재발급 성공');
            dispatch(changeAccessToken({access_token: res.access_token}));
            navigate(`/${cat}/edit`);
          }
          // 2-2. refresh_token: 5분미만 유효
          //      access_token, refresh_token 둘다 재발급 성공
          else if(statusCode === 20009){
            console.log('2-2. refresh_token: 5분미만 유효');
            console.log('     access_token, refresh_token 둘다 재발급 성공');
            dispatch(changeBothToken({
              access_token: res.access_token,
              refresh_token: res.refresh_token
            }));
            navigate(`/${cat}/edit`);
          }
          // 2-3. refresh_token: 만료 혹은 기타 문제
          //      재로그인 하도록 유도
          else{
            console.log('2-3. refresh_token: 만료 혹은 기타 문제');
            console.log('     재로그인 하도록 유도');
            alert('오래 대기하여 로그아웃되었습니다. 다시 로그인하세요.');
            dispatch(changeLoginStatus(false));
            dispatch(changeLoginToggle(true));
          }
        })
        // 2-4. 서버와의 연결문제로 statusCode 확인불가
        .catch(err=>{
          console.log(err);
          alert('서버와의 통신이 원할하지 않습니다. 잠시후 시도해주세요');
        })
    }

    useEffect(()=>{
      axios.get(`http://${ip}/api/list?category=${category}&page=${currentPage}`)
        .then(res=>{
          let data = res.data;
          setTextList(data.content);
          setTotalNum(data.totalElements);
          setTotalPage(data.totalPages);

          data.content.forEach((a,i)=>{
            let date = new Date(a.createdTime);
            data.content[i].createdTime = date.toLocaleString()
          })
        })
        .catch((err)=>{
          console.log(err);
          setServerErr(true);
        })
      const fadeTimer = setTimeout(()=>{setFade('end')}, 100)
      return ()=>{
        clearTimeout(fadeTimer);
        setFade('')
      }
    }, [currentPage])
  
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
                    <td className='board-title' onClick={()=>{
                      navigate(`/${category}/detail/${data.id}`);
                      }}><a>{data.textTitle}</a></td>
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
      
        <button className='board-homeBtn' onClick={()=>{navigate('/')}}>홈으로</button>
        <button className='board-newBtn' onClick={()=>{

          axios.defaults.headers.common['Authorization'] = token.access_token;
          axios.defaults.withCredentials = true;

          axios.get(`http://${ip}/api/user`)
            .then(res=>{
              let statusCode = res.data.statusCode;
              let cat = category.toLowerCase();

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

                silentRefresh();
              }
              // 3. access_token, refresh_token 없이 접근시도
              //    로그인 하도록 유도
              else{
                console.log('3. access_token, refresh_token 없이 접근시도');
                console.log('   로그인 하도록 유도');
                alert('로그인이 필요한 서비스입니다.');
              }
            })
          }}>글쓰기</button>
      </div>
      </>
    )
  }



export {Board};