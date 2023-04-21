import { Routes, Route } from 'react-router-dom';
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import {Login} from './pages/Login';
import { useSelector } from 'react-redux';
import {Banner} from './components/Banner';
import { Gacha } from './pages/Gacha';
import './styles/App.css';
import {Navbar} from './components/Navbar';
import styled, { ThemeProvider } from 'styled-components';
import {dark, light} from './theme/theme';
import { useTheme } from './theme/useTheme';
import {Mypage} from './pages/Mypage';
import {Main} from './pages/Main';
import {Footer} from './components/Footer'
import GlobalStyles from './components/GlobalStyles';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [themeMode, toggleTheme] = useTheme();
  const theme = themeMode === 'light' ? light : dark;
  const login_status = useSelector((state)=> {return state.loginInfo.login_status});
  const isDark = localStorage.getItem('theme');
  
  const toggleDarkmode = (e)=>{
    toggleTheme();
    e.currentTarget.classList.toggle('dark');
  }
  
  return (
    <>
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme}/>
        <div className="App">
          <div id='pageTop'></div>
          {
            login_status && <Login/>
          }
          <Navbar/>
          {/* <Banner/> */}
          <div id='wrapper'>
            <label htmlFor="toggle" className={"toggle-switch "+themeMode} onClick={toggleDarkmode}>
              <h4>{themeMode}</h4>
              <span className="toggle-btn"></span>
            </label>
            <Routes>
              <Route path="/" element={<Main/>}/>
              <Route path="/list/:type/:category/:currentPage" element={<Board/> } />
              <Route path="/detail/:category/:id/:currentPage" element={<Detail/>}/>
              <Route path="/modify/:category/:id" element={<Edit/>}/>
              <Route path="/edit/:category" element={<Edit/>}/>
              <Route path="/mypage/:nickname/:currentPage" element={<Mypage/>}/>
              <Route path="/gacha" element={<Gacha/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/hello" element={<Hello/>}/>
              <Route path="*" element={<Error/>}/>
            </Routes>
            <a href='#pageTop' className='top-btn'><p>Top</p></a>

            <Footer/>
          </div>
          
        </div>
    </ThemeProvider></>
  );
}

function Hello(){
  const [scrollY, setScrollY] = useState(window.scrollY);
  const testRef = useRef([]);
  useEffect(()=>{
    window.addEventListener('scroll', handleScroll, {capture: true})
    return()=>{
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const handleScroll = (e)=>{
    console.log(window.scrollY)
    const scrollY = window.scrollY;
    let i = 0;
    testRef.current.map((el)=>{
      el.style.transform = `scale(${(97+i)/90 - scrollY/4500})`;
      el.style.opacity = (16+i)/9 - scrollY/450;
      i += 10
    })
  }

  return(
  <>
  <h1 className='hello-h1'>어서오세요!</h1>
    <div className='hello-container'>
      <div className='hello-box hello1' ref={el => testRef.current[0] = el}>
        <img className='hello-img-l' alt='hello_img1' src={process.env.PUBLIC_URL + '/hello_img1.jpg'}/>
        <h4>아직도 개발을 혼자하세요??</h4>
      </div>
      <div className='hello-box hello2' ref={el => testRef.current[1] = el}>
        <img className='hello-img-r' alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        <h4>hello-box2</h4>
      </div>
      <div className='hello-box hello3' ref={el => testRef.current[2] = el}>
        <img className='hello-img-l' alt='main_img1' src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        <h4>hello-box3</h4>
      </div>
      <div className='hello-box hello4'>
        <img className='hello-img-r' alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        <h4>hello-box4</h4>
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