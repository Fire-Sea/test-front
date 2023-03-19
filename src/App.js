import './App.css';
import { useParams } from 'react-router-dom';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Input} from './Input'
import {Board} from './pages/Board'

function App() {
  let [textList, setTextList] = useState([]);

  return (
    <div className="App">

      <Navbar/>

      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/server/list/:id" element={<Board category={'Server'} textList={textList} setTextList={setTextList}/>}/>
        <Route path="/front/list/:id" element={<Board category={'Front'} textList={textList} setTextList={setTextList}/>}/>
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
        <a className='navbar-item' onClick={()=>{navigate('/server/0')}}>Server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front/0')}}>Front</a>
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
          <div className='img-overlay' onClick={()=>{navigate('/front/list/0')}}>Front</div>
          <img src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list/0')}}>Server</div>
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

function Edit(){
  let navigate = useNavigate();
  let {category} = useParams();

  return(
    <>
      <Input/>
      <div className='edit-container'>
        <input className='edit-title' placeholder='제목을 입력하세요'/>
        <textarea className='edit-body' placeholder='내용을 작성하세요'/>
        <div className='edit-btn'>
          <button onClick={()=>{navigate(-1)}}>취소</button>
          <button onClick={()=>{
            let textTitle = document.querySelector('.edit-title').value;
            let textBody = document.querySelector('.edit-body').value;
            textBody = textBody.replaceAll('\r\n', '<br>');
            if(!textTitle){
              alert('제목을 입력하세요');
            }
            else if(!textBody){
              alert('내용을 입력하세요');
            }
            else{
              fetch("http://172.30.1.84:8080/api/send", {
                method: "POST",
                headers:{
                  "content-type" : "application/json"
                },
                body: JSON.stringify({
                  category: category,
                  textTitle: textTitle,
                  textBody: textBody
                })
              })
                .then(res=>res.json())
                .then((res)=>{
                  
                  if(parseInt(res.statusCode) === 20000){
                     alert('글이 저장되었습니다.');
                     navigate(`/${category}/list/0`);
                  }
                })
                .catch(err=>console.log(err));
            }
          }}>글 저장하기</button>
        </div>
      </div>
    </>
  )
}


function Detail({category}){
  let {id} = useParams();
  let [textData, setTextData] = useState({});
  let navigate = useNavigate();
  useEffect(()=>{

    fetch(`http://localhost:8080/api/detail/?category=${category}&id=${id}`, {
    method: 'GET',
    headers: {
      "content-type" : "application/json"
    },
  })
    .then(res=>res.json())
    .then(data=>{
      setTextData(data);
    })
    .catch(err=>console.log(err))
  
  }, [])
  return(
    <>
      <Input/>
      
      <div className='detail-container'>
        <div className='detail-title'>
          <h3>{textData.textTitle}</h3>
        </div>
        <div className='detail-body'>
          <textarea className='detail-body' value={textData.textBody} disabled/>
          {/* <p>{textData.textBody}</p> */}
        </div>
        </div>
      <button onClick={()=>{navigate(-1)}}>뒤로가기</button>
    </>
  )
}
export default App;
