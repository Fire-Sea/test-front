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
    <ThemeProvider theme={theme}>
      <S.Main>
        <div className="App">
          <div id='pageTop'></div>
          {
            login_status && <Login/>
          }
          <Navbar/>
          <Banner/>
          <div id='wrapper' style={{'textAlign': 'center'}}>
            
            <label htmlFor="toggle" className={"toggle-switch "+isDark} onClick={toggleDarkmode}>
              <h4>{isDark}</h4>
              <span className="toggle-btn"></span>
            </label>
            <Routes>
              <Route path="/" element={<Main/>}/>
              <Route path="/list/:category/:currentPage" element={<Board/> } />
              <Route path="/detail/:category/:id/:currentPage" element={<Detail/>}/>
              <Route path="/modify/:category/:id" element={<Edit/>}/>
              <Route path="/edit/:category" element={<Edit/>}/>
              <Route path="/mypage/:nickname/:currentPage" element={<Mypage/>}/>
              <Route path="/gacha" element={<Gacha/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="*" element={<Error/>}/>
            </Routes>
            <a href='#pageTop' className='top-btn'><p>Top</p></a>

            <Footer/>
          </div>
          
        </div>
      </S.Main>
    </ThemeProvider>
  );
}

function Error(){
  return(
    <div>err</div>
  )
}

export default App;

const S = {};
S.Main = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.bgColor};
  color: ${props => props.theme.colors.titleColor};
  transition: 0.5s all;
`;