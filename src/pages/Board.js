import { Routes, Route, useNavigate, Outlet, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../Input';

function Board({category, ip, loginInfo}){
  let [textList, setTextList] = useState([]);
    let navigate = useNavigate();
    let [currentPage, setCurrentPage] = useState(0);
    let [totalNum, setTotalNum] = useState(0);
    let [totalPage, setTotalPage] = useState(0);
    let [serverErr, setServerErr] = useState(false);

    console.log(loginInfo);

    const addCnt = (pageNum, currentPage)=>{
      const newArr = [];
      for(let i=0; i<pageNum; i++){
        let template = '';
        if(i == currentPage){
          template = <button className='board-clicked' onClick={()=>{setCurrentPage(i);}} key={i}>{i+1}</button>;
        }
        else{
          template = <button onClick={()=>{setCurrentPage(i);}} key={i}>{i+1}</button>;
        }
        newArr.push(template);
      }
      return newArr;
    }

    useEffect(()=>{
      let sub = 'firesea.o-r.kr:8080';
      fetch(`http://${ip}/api/list?category=${category}&page=${currentPage}`, {
      method: 'GET',
      headers: {
        "content-type" : "application/json"
      },
    })
      .then(res=>res.json())
      .then(data=>{
        setTextList(data.content);
        setTotalNum(data.totalElements);
        setTotalPage(data.totalPages);

        console.log(data);

        data.content.forEach((a,i)=>{
          let date = new Date(a.createdTime);
          data.content[i].createdTime = date.toLocaleString()
        })
      })
      .catch((err)=>{
        console.log(err);
        setServerErr(true);
      })
    
    }, [currentPage])
  
    return(
      <>
      <Input/>
      <div className='board'>
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
               serverErr && <tr><td colSpan={3}><h1>서버가 일을 안해 시발</h1></td></tr> 
            }
            {
              
              textList.map((data, i)=>{
                return(
                  <tr className='board-tr' key={i}>
                    <td className='board-id'>{totalNum-(currentPage*10)-i}</td>
                    <td className='board-title' onClick={()=>{navigate(`/${category}/detail/${data.id}`)}}><a>{data.textTitle}</a></td>
                    <td className='board-nickname'>{data.nickname}</td>
                    <td className='board-date'>{data.createdTime}</td>
                  </tr>
                )
              })
            }  
            <tr><td className='board-line' colSpan={3}></td></tr>
          </tbody>
        </table>
        <div className='board-pages'>
          {
            addCnt(totalPage, currentPage)
          }
        </div>
      
        <button className='board-homeBtn' onClick={()=>{navigate('/')}}>홈으로</button>
        <button className='board-newBtn' onClick={()=>{
          let cat = category.toLowerCase();;
          navigate(`/${cat}/edit`);
        }}>글작성</button>
        <Outlet/>
      </div>
      </>
    )
  }


export {Board};