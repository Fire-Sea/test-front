import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../components/Input";
import "../styles/Main.css"
function Main(){
  let navigate = useNavigate();
  let [fade, setFade] = useState('');
  const isDark = localStorage.getItem('theme');
  
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
      <div className={'main start '+ fade}>
        <h1>게시판</h1>
        <div className='main-img'>
          <div className={'img-overlay main-' + isDark} onClick={()=>{navigate('/list/board/front/0')}}>Front</div>
          <img alt='main_img1' src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className={'img-overlay main-' + isDark} onClick={()=>{navigate('/list/board/server/0')}}>Server</div>
          <img alt='main_img2' src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
        </div>
        <h1>게임</h1>
        <div className='main-game'>
          <div className={'img-overlay main-' + isDark} onClick={()=>{navigate('/gacha')}}>Game</div>
          <img alt='main_img3' src={process.env.PUBLIC_URL + '/main_img3.jpg'}/>
        </div>
      </div>
    </>
  )
}

export {Main};