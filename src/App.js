import './App.css';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'

function App() {
  let [textList, setTextList] = useState([]);

  return (
    <div className="App">

      <Navbar/>

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} textList={textList} setTextList={setTextList}/>}/>
        <Route path="/front/list/" element={<Board category={'Front'} textList={textList} setTextList={setTextList}/>}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'}/>}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'}/>}/>

        <Route path="/:category/edit" element={<Edit/>}/>


        <Route path="*" element={<Error/>}/>
      </Routes>

  
    </div>
  );
}

function Navbar(){
  let navigate = useNavigate();
  return(
    <div className='header'>
      <div className='navbar'>
        <a className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</a>
        <a className='navbar-item' onClick={()=>{navigate('/server/list')}}>Server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front/list')}}>Front</a>
      </div>
    </div>
  )
}



function Main(){
  let navigate = useNavigate();

  return(
    <>
      <Input/>
      <div className='main'>
        <div className='main-img'>
          <div className='img-overlay' onClick={()=>{navigate('/front/list')}}>Front</div>
          <img src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list')}}>Server</div>
          <img src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        </div>
      </div>

      <button onClick={()=>{
        fetch('http://localhost:8080/hello', {
          method: 'POST',
        })``
        .then((d)=>{console.log(d)})
      }}>ajax 테스트</button>
    </>
  )
}

function Error(){

  return(
    <div>err</div>
  )
}

// post api : :8080/api/send textTitle textBody




export default App;
