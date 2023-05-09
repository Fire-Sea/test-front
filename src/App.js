import { Routes, Route, useNavigate } from 'react-router-dom';
import {Board} from './pages/Board'
import {Edit} from './pages/Edit'
import {Detail} from './pages/Detail'
import {Register} from './pages/Register'
import {Login} from './pages/Login';
import { useDispatch, useSelector } from 'react-redux';
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
import { useEffect, useState, useRef, useDebugValue } from 'react';
import { changeLoginStatus } from './store';
import { SNSRegister } from './pages/SNSRegister';
function App() {
  const [themeMode, toggleTheme] = useTheme();
  const theme = themeMode === 'light' ? light : dark;
  const login_status = useSelector((state)=> {return state.loginInfo.login_status});
  const navigate = useNavigate();
  const toggleDarkmode = (e)=>{
    toggleTheme();
    e.currentTarget.classList.toggle('dark');
  }
  useEffect(()=>{
    if(localStorage.getItem('snsLogin')){
      localStorage.removeItem('snsLogin');
      navigate('/sns')
    }
  })
  return (
    <>
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme}/>
        <div className="App">
          <div id='pageTop'></div>

          {
            login_status && <div style={{'textAlign':'center'}}><Login/></div>
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
              <Route path="/sns" element={<SNSRegister/>}/>
              <Route path="*" element={<Error/>}/>
            </Routes>
            <a href='#pageTop' className='top-btn'><p>Top</p></a>
            <Footer/>
          </div>
        </div>
    </ThemeProvider></>
  );
}

function Error(){
  return(
    <div>err</div>
  )
}

export default App;