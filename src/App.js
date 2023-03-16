import './App.css';
import { useParams } from 'react-router-dom';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import a from './example.js';
import { isCompositeComponent } from 'react-dom/test-utils';

function App() {    
  
  return (
    <div className="App">

      <Navbar/>

      <Routes>
        <Route path="/" element={<Main/>}/>

        <Route path="/server" element={<Board category={'server'}/>}/>
        <Route path="/front" element={<Board category={'front'}/>}/>
        <Route path="/edit" element={<Edit/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>

      <div className='content'>

        <button onClick={()=>{
            fetch("http://172.30.1.48:8080/hello3")
            .then((res)=>res.text())
            .then((result)=>console.log(result));
          }}>hi</button>
        <button onClick={()=>{
          fetch("http://172.30.1.48:8080/hello2", {
            method: "POST",
            body: JSON.stringify({
              email: "id",
              password: "pw"
            })
          })
            .then((res)=> console.log(res))
        }}>POST</button>
      </div>
    </div>
  );
}

function Navbar(){
  let navigate = useNavigate();
  return(
    <div className='header'>
      <div className='navbar'>
        <a className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</a>
        <a className='navbar-item' onClick={()=>{navigate('/server')}}>Server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front')}}>Front</a>
      </div>
    </div>
  )
}

function Input(){

  return(
    <div className='search'>
      <div className='search-container'>
        <input className='search-input' placeholder='검색어를 입력하세요'/>
        <button className='search-btn'>검색</button>
      </div>
    </div>
  )
}

function Main(){
  return(
    <>
      <Input/>
      <div className='main'>
        <img src={process.env.PUBLIC_URL + '/main_img.jpg'} width="40%"/>
      </div>
    </>
  )
}

function Error(){

  return(
    <div>err</div>
  )
}

function Board({category}){
  let navigate = useNavigate();
  let id=9;
  let test=[];
  let [list, setList] = useState([]);  

  return(
    <>
    <Input/>
    <div className='board'>
      
      <h1 className='board-category'>{category}</h1>
      <button onClick={async ()=>{
        await fetch('http://172.30.1.48:8080/api/list', {
          method: 'GET',
          headers: {
            "content-type" : "application/json"
          },
        })
        .then(res=>res.text())
        .then(res=>{
          //test = [...JSON.parse(res).content];
          test = [...JSON.parse(res).content]
          setList(test);
          console.log(list);
        })
        .catch(err=>console.log(err))
        
        
      }}>ajax요청</button>
      {
        list.forEach((a)=>{
          return(
            <div>{a.textTitle}</div>
          )
        })
      }
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>date</th>
          </tr>
        </thead>
        <tbody>
        
          <tr>
            <td className='board-id'>id1</td>
            <td className='board-title'><a onClick={()=>{navigate(`${id}`)}}>tasdfsssssale1</a></td>
            <td className='board-date'>date1</td>
          </tr>
          <tr>
            <td className='board-id'>id1</td>
            <td className='board-title'><a href='*'>tasdfale1</a></td>
            <td className='board-date'>date1</td>
          </tr>
        </tbody>
      </table>

      <button className='board-new' onClick={()=>{navigate('/edit')}}>글작성</button>
      <Outlet/>
    </div>
    </>
  )
}

// post api : :8080/api/send textTitle textBody

function Edit(){
  return(
    <>
      <div className='edit-container'>
        <select style={{'display': 'block', 'marginLeft' : 'auto', 'marginRight' : 'auto'}}>
          <option value="server">server</option>
          <option value="front">front</option>
        </select>
        <input className='edit-title' placeholder='제목을 입력하세요'/>
        <textarea className='edit-body' placeholder='내용을 작성하세요'></textarea>
        <button className='edit-send' onClick={()=>{
          let textTitle = document.querySelector('.edit-title').value;
          let textBody = document.querySelector('.edit-body').value;
          
          if(!textTitle){
            alert('제목을 입력하세요');
          }
          else if(!textBody){
            alert('내용을 입력하세요');
          }
          else{
            fetch("http://172.30.1.48:8080/api/send", {
              method: "POST",
              headers: {
                "content-type" : "application/json"
              },
              body: JSON.stringify({
                textTitle: textTitle,
                textBody: textBody
              })
            })
              .then(res => console.log(res));
            
          }
        }}>글 저장하기</button>
      </div>
    </>
  )
}
export default App;
