import { Routes, Route, useNavigate } from 'react-router-dom';
import {Input} from './Input'
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import {Login} from './pages/Login';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Banner} from './Banner';
import './styles/App.css';
import { changeLoginStatus, changeBothToken, changeLoginToggle } from './store';

function App() {

  let [easteregg, setEasteregg] = useState(false);
  let token = useSelector((state)=> {return state.token});
  let dispatch = useDispatch();
  return (
    <div className="App">
      {
        token.login_toggle && <Login/>
      }
      <Navbar/>
        
      {
        token.login_status ? 
          <button onClick={()=>{
            dispatch(changeLoginStatus(false));
            dispatch(changeBothToken({}));
          }}>로그아웃</button> 
          : 
          <button onClick={()=>{
            dispatch(changeLoginToggle(true));
          }}>로그인</button>
      }

      {
        easteregg && <div className='easteregg'><h1>서버가~~일을~~안해~~~</h1></div>
      }

      <button onClick={()=>{
        console.log(`(at/rt/login_status)=> ${token.access_token}/${token.refresh_token}/${token.login_status}`);
      }}>현재 토큰, 로그인상황 콘솔</button>


      <button onClick={()=>{
        let t = document.querySelectorAll('.navbar a');
        if(!easteregg){
          document.querySelector('body').style = 'animation: bodyanime infinite 3s;'; 
          
          t.forEach((a)=>{
            a.style = 'animation: barrelroll 1s infinite;';
          }) 
          setEasteregg(true);
        }
        else{
          document.querySelector('body').style = '';
          t.forEach((a)=>{
            a.style = '';
          }) 
          setEasteregg(false);
        }
      }}>easteregg</button>
      {/* <Banner/> */}

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/" element={<Board category={'Server'} />}/>
        <Route path="/front/list/" element={<Board category={'Front'} />}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/server/detail/:id" element={<Detail category={'server'} />}/>
        <Route path="/front/detail/:id" element={<Detail category={'front'} />}/>

        <Route path="/register" element={<Register/>}/>

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
  let [fade, setFade] = useState('');

  useEffect(()=>{
    const fadeTimer = setTimeout(()=>{setFade('end')}, 100);

    return()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])
  return(
    <>
      <Input/>
      <div className={'main start ' + fade}>
        <div className='main-img'>
          <div className='img-overlay' onClick={()=>{navigate('/front/list')}}>Front</div>
          <img alt='main_img1' src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list')}}>Server</div>
          <img alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        </div>
      </div>
    </>
  )
}

function Error(){

  return(
    <div>err</div>
  )
}


export default App;