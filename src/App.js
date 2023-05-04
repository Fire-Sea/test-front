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
              <Route path="/" element={<Hello/>}/>
              <Route path="/list/:type/:category/:currentPage" element={<Board/> } />
              <Route path="/detail/:category/:id/:currentPage" element={<Detail/>}/>
              <Route path="/modify/:category/:id" element={<Edit/>}/>
              <Route path="/edit/:category" element={<Edit/>}/>
              <Route path="/mypage/:nickname/:currentPage" element={<Mypage/>}/>
              <Route path="/gacha" element={<Gacha/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/sns" element={<SNSRegister/>}/>
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
  const navigate = useNavigate();
  const [themeMode, toggleTheme] = useTheme();
  const value = localStorage.getItem('theme');
  const isDark = value == undefined ? themeMode : value;
  const dispatch = useDispatch();
  useEffect(()=>{
    window.addEventListener('scroll', handleScroll, {capture: true})
    return()=>{
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const handleScroll = (e)=>{
    //console.log(window.scrollY)
    const scrollY = window.scrollY;
    let i = 0;

    testRef.current.map((el)=>{
      if(el){
        el.style.transform = `scale(${(5250+i*40-scrollY)/5270})`;
        //console.log((5523-scrollY)/5270)
        el.style.opacity = (16+i)/9 - scrollY/450;
        i += 10
      }
    })
    
  }

  return(
  <>
  <h1 className='hello-h1'>어서오세요!</h1>
    <div className={'hello-container hello-container-' + isDark}>
      <div className='hello-content'>
        <div className='hello-direct'>
          <p className='hello-title'>게시판 가기</p>
          <div className='hello-hidden'>
            <div className='hello-board' onClick={()=>navigate('/list/board/front/0')}>Front</div>
            <div className='hello-board' onClick={()=>navigate('/list/board/server/0')}>Server</div>
          </div>
        </div>
        <div className='hello-direct' onClick={()=>navigate('/gacha')}><p>게임하러 가기</p></div>
      </div>
      <div className='hello-box hello1' ref={el => testRef.current[0] = el}>
        <img className='hello-img-l' alt='hello_img1' src={process.env.PUBLIC_URL + '/janga.gif'}/>
        <div className='hello-text-r'>
          <h2>소통이 안돼요</h2>
          <p>최근 통계를 보면 현업 개발자 <strong>대다수</strong>가 프로젝트를 진행하는데 앞서 각 포지션과의 소통에 어려움을 겪는 것으로 조사되었습니다.</p>
          <p>소통에서 생긴 적절한 마찰은 더 좋은 결과를 도출할 수도 있지만, 대부분의 경우 프로젝트에 악영향을 미치죠.</p>
          <p className='hello-disappear'>서로 간의 갈등은 커지고 프로젝트 진행에 차질까지...</p>
        </div>
      </div>
      <div className='hello-box hello2' ref={el => testRef.current[1] = el}>
        <img className='hello-img-r' alt='main_img2' src={process.env.PUBLIC_URL + '/throw-away.gif'}/>
        <div className='hello-text-l'>
          <h2>저만 이런 건가요...?</h2>
          <p>분명 프로젝트를 진행하고는 있지만 이게 정말 제대로 된 프로젝트인지, 혹은 올바른 기술을 사용하는 것인지 헷갈릴 때가 많습니다.</p>
          <p>또, 덕지덕지 어떻게든 구현한 코드는 에러가 떠버리고 컴퓨터는 항상 말썽이죠... 이럴 때마다 컴퓨터를 버리고 싶은 충동을 느껴요.</p>
          <p>이런 건 저만 느끼는 건지 아니면 다른 개발자들도 그런 것인지 소통할 길도 찾지 못하겠어요.</p>
        </div>
      </div>
      <div className='hello-box hello3' ref={el => testRef.current[2] = el}>
        <img className='hello-img-l' alt='main_img1' src={process.env.PUBLIC_URL + '/full-stack.webp'}/>
        <div className='hello-text-r'>
          <h2>그런분들을 위해 준비했습니다.</h2>
          <p>각 포지션이 가진 애로 사항을 마음껏 공유할 수 있는 곳.</p>
          <p>글로 서로의 의견을 주고받으며 개인적 생각을 정리할 수 있는 곳.</p>
          <p>같은 포지션 끼리 서로의 코드를 공유하며 더 생산성 높은 코드를 학습할 수 있는 곳.</p>
          <p><strong>개발자 역량을 더욱 향상시킬 수 있는 곳...!</strong></p>
        </div>
      </div>
      <div className='hello-box hello4'>
        <img alt='main_img' src={process.env.PUBLIC_URL + '/main_img1.jpg'} width={300}/>
        <h1>지금 시작해보세요!</h1>
        <button onClick={()=>{navigate('list/board/front/0')}}>지금 시작하기</button>
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