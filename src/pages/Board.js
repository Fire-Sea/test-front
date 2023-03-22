import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../Input';
import axios from 'axios';
import {useSelector} from 'react-redux';
import '../styles/Board.css';

function Board({category, loginInfo}){
  let [textList, setTextList] = useState([]);
    let navigate = useNavigate();
    let [currentPage, setCurrentPage] = useState(0);
    let [totalNum, setTotalNum] = useState(0);
    let [totalPage, setTotalPage] = useState(0);
    let [serverErr, setServerErr] = useState(false);
    let ip = useSelector((state) => {return state.ip})
    let [fade, setFade] = useState('');

    console.log('Board의 loginInfo: ' + loginInfo);

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
          let cat = category.toLowerCase();;
          navigate(`/${cat}/edit`);
        }}>글작성</button>
        
      </div>
      </>
    )
  }


export {Board};