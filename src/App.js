import './App.css';
import { useParams } from 'react-router-dom';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';

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
            .then((result) => console.log(result));
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


function Edit(){
  console.log('졸려')
  return(
    <>
    <div>cival</div>
    <div>cival</div>
    <div>cival</div>
    <div>cival</div>
    <div>cival</div>
    <div>cival</div></>
  )
}
export default App;
