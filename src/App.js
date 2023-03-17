import './App.css';
import { useParams } from 'react-router-dom';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import a from './example.js';
import { isCompositeComponent } from 'react-dom/test-utils';
import { paste } from '@testing-library/user-event/dist/paste';

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
          <div className='img-overlay' onClick={()=>{navigate('/front/list/0')}}>Front</div>
          <img src={process.env.PUBLIC_URL + '/main_img1.jpg'}/>
        </div>
        <div className='main-img'>
        <div className='img-overlay' onClick={()=>{navigate('/server/list/0')}}>Server</div>
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

function Board({category, textList, setTextList}){
  let navigate = useNavigate();

  useEffect(()=>{

    fetch(`http://172.30.1.84:8080/api/list?category=${category}&page=0`, {
    method: 'GET',
    headers: {
      "content-type" : "application/json"
    },
  })
    .then(res=>res.json())
    .then(data=>{
      setTextList(data.content);
      console.log(data.numberOfElements);
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
                  <td className='board-title' onClick={()=>{navigate(`/${category}/detail/${data.id}`)}}><a>{data.textTitle}</a></td>
                  <td className='board-date'>{data.createdTime}</td>
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
      <button className='board-new' onClick={()=>{
        let cat = category.toLowerCase();;
        navigate(`/${cat}/edit`);
      }}>글작성</button>
      <Outlet/>
    </div>
    </>
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

    fetch(`http://172.30.1.84:8080/api/detail/?category=${category}&id=${id}`, {
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
