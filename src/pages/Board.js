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
              if(statusCode === 20011){
                let cat = category.toLowerCase();
                navigate(`/${cat}/edit`);
                console.log('토큰 유효함')
              }
              // 토큰 재발급(만료)
              else if(statusCode === 40006){
                axios.defaults.headers.common['Authorization'] = token.refresh_token;
                axios.get(`http://${ip}/api/refresh`)
                  .then(res=>{
                    res = res.headers;
                    dispatch(changeAccessToken({
                      access_token: res.access_token
                    }))
                    console.log('access_token 만료되어 at 새로 발급받음 => access_token: ' + res.access_token);
                  })
              }
              else if(statusCode === 20009){
                axios.defaults.headers.common['Authorization'] = token;
                axios.get(`http://${ip}/api/refresh`)~
                  .then(res=>{
                    res = res.headers;
                    dispatch(changeBothToken({
                      access_token: res.access_token,
                      refresh_token: res.refresh_token
                    }))
                    console.log('refresh_token 만료기간이 5분 미만으로 at, rt 새로 발급받음 => access_token: ' + res.access_token + '/refresh_token: ' + res.refresh_token);
                  })
              }
              else{
                alert('오랫동안 대기하여 로그아웃 되었습니다. 새로 로그인하세요.');
                console.log('refresh_token 만료되어 로그인창으로 리다이렉트');
                dispatch(changeLoginStatus(false));
                dispatch(changeLoginToggle(true));
              }
            })
            .catch(err=>{
              console.log(err);
              alert('로그인 후 사용할 수 있습니다.');
              console.log('기타 서버 에러 및 로그아웃상태에서 접근시도');
              dispatch(changeLoginStatus(false))
              dispatch(changeLoginToggle(true));
            })
          
        }}>글작성</button>
        
      </div>
      </>
    )
  }


export {Board};