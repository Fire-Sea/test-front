import { useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../Input';

function Board({category, textList, setTextList}){
    let navigate = useNavigate();
    let [getErr, setGetErr] = useState(false);
    useEffect(()=>{
  
      fetch(`http://localhost:8080/api/list?category=${category}&page=0`, {
      method: 'GET',
      headers: {
        "content-type" : "application/json"
      },
    })
      .then(res=>res.json())
      .then(data=>{
        setTextList(data.content);
        console.log(data.numberOfElements);
        setGetErr(false);
      })
      .catch((err)=>{
        console.log(err);
        setGetErr(true);
      })
    
    }, [])
  
    return(
      <>
      <Input/>
      <div className='board'>
        <h1 className='board-category'>{category}</h1>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {
               getErr && <tr><td colSpan={3}><h1>서버가 일을 안해 시발</h1></td></tr> 
            }
            {
              
              textList.map((data, i)=>{
                return(
                  <tr className='board-tr' key={i}>
                    <td className='board-id'>{data.id}</td>
                    <td className='board-title' onClick={()=>{navigate(`/${category}/detail/${data.id}`)}}><a>{data.textTitle}</a></td>
                    <td className='board-date'>{data.createdTime}</td>
                  </tr>
                )
              })
            }  
            
            <tr><td className='board-line' colSpan={3}></td></tr>
          </tbody>
        </table>
        <button onClick={()=>{navigate('/')}}>홈으로</button>
        <button className='board-new' onClick={()=>{
          let cat = category.toLowerCase();;
          navigate(`/${cat}/edit`);
        }}>글작성</button>
        <Outlet/>
      </div>
      </>
    )
  }

export {Board};