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
        <Route path="/server/:page" element={<Board category={'server'}/>}/>
        <Route path="/front/:page" element={<Board category={'front'}/>}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/edit" element={<Edit/>}/>
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
  let navigate = useNavigate();

  return(
    <>
      <Input/>
      <div className='main'>
        <div className='main-img'>
          <div className='img-overlay' onClick={()=>{navigate('/front/0')}}>Front</div>
          <img src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/0')}}>Server</div>
          <img src={process.env.PUBLIC_URL + '/main_img2.jpg'}/>
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

function Board({category}){
  let navigate = useNavigate();
  let [textList, setTextList] = useState([]);

  useEffect(()=>{

    fetch('http://localhost:8080/list', {
    method: 'GET',
    headers: {
      "content-type" : "application/json"
    },
  })
    .then(res=>res.json())
    .then(data=>{
      setTextList([...data].reverse());
    })
    .catch(err=>console.log(err))
  
  }, [])

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
          {
            textList.map((data, i)=>{
              return(
                <tr className='board-tr' key={i}>
                  <td className='board-id'>{data.id}</td>
                  <td className='board-title' onClick={()=>{navigate(`/detail/${data.id}`)}}><a>{data.textTitle}</a></td>
                  <td className='board-date'>{data.createdDate}</td>
                </tr>
              )
            })
          }
          {/* <tr>
            <td className='board-id'>id1</td>
            <td className='board-title'><a>tasdfsssssale1</a></td>
            <td className='board-date'>date1</td>
          </tr> */}
          <tr><td className='board-line' colSpan={3}></td></tr>
        </tbody>
      </table>
      <button onClick={()=>{navigate('/')}}>홈으로</button>
      <button className='board-new' onClick={()=>{navigate('/edit')}}>글작성</button>
      <Outlet/>
    </div>
    </>
  )
}


function Edit(){
  let navigate = useNavigate();
  return(
    <>
      <Input/>
      <div className='edit-container'>
        <select className='edit-select'>
          <option>front</option>
          <option>server</option>
        </select>
        <input className='edit-title' placeholder='제목을 입력하세요'/>
        <textarea className='edit-body' placeholder='내용을 작성하세요'/>
        <div className='edit-btn'>
          <button onClick={()=>{navigate('/')}}>취소</button>
          <button onClick={()=>{
            let textTitle = document.querySelector('.edit-title').value;
            let textBody = document.querySelector('.edit-body').value;
            if(!textTitle){
              alert('제목을 입력하세요');
            }
            else if(!textBody){
              alert('내용을 입력하세요');
            }
            else{
              fetch("http://localhost:8080/post", {
                method: "POST",
                headers:{
                  "content-type" : "application/json"
                },
                body: JSON.stringify({
                  textTitle: textTitle,
                  textBody: textBody
                })
              })
                .then(res=>res.text())
                .then((res)=>{
                  if(res === 'success'){
                    alert('글이 저장되었습니다.');
                    navigate('/server');
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


function Detail(){
  let {id} = useParams();
  return(
    <>
      <Input/>
      <div>{id}</div>
    </>
  )
}
export default App;
