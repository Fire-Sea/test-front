import { Routes, Route, useNavigate } from 'react-router-dom';
import { Board } from './pages/Board'
import { Edit } from './pages/Edit'
import { Detail } from './pages/Detail'
import { Register } from './pages/Register'
import { Login } from './pages/Login';
import { Mypage } from './pages/Mypage';
import { Main } from './pages/Main';
import { Gacha } from './pages/Gacha';
import { SNSRegister } from './pages/SNSRegister';
import { Game } from './pages/Game';
import { useSelector } from 'react-redux';
import { Banner } from './components/Banner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer'
import GlobalStyles from './components/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { dark, light } from './theme/theme';
import { useTheme } from './theme/useTheme';
import { useEffect } from 'react';
import './styles/App.css';

function App() {
  const [themeMode, toggleTheme] = useTheme();
  const theme = themeMode === 'light' ? light : dark;
  const login_status = useSelector((state) => { return state.loginInfo.login_status });
  const navigate = useNavigate();
  const toggleDarkmode = (e) => {
    toggleTheme();
    e.currentTarget.classList.toggle('dark');
  }
  useEffect(() => {
    navigate('/')
  }, [])
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <div className="App">
          <div id='pageTop'></div>
          {
            login_status && <div style={{ 'textAlign': 'center' }}><Login /></div>
          }
          <Navbar />
          {/* <Banner/> */}
          <div id='wrapper'>
            <label htmlFor="toggle" className={"toggle-switch " + themeMode} onClick={toggleDarkmode}>
              <h4>{themeMode}</h4>
              <span className="toggle-btn"></span>
            </label>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/list/:type/:category/:currentPage" element={<Board />} />
              <Route path="/detail/:category/:id/:currentPage" element={<Detail />} />
              <Route path="/modify/:category/:id" element={<Edit />} />
              <Route path="/edit/:category" element={<Edit />} />
              <Route path="/mypage/:nickname/:currentPage" element={<Mypage />} />
              <Route path="/gacha" element={<Gacha />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sns" element={<SNSRegister />} />
              <Route path="/game" element={<Game />} />
              <Route path="*" element={<Error />} />
            </Routes>
            <a href='#pageTop' className='top-btn'><p>Top</p></a>
            <Footer />
          </div>
        </div>
      </ThemeProvider></>
  );
}

function Error() {
  return (
    <div>Wrong Access!</div>
  )
}

export default App;