import './App.css';
import { useParams } from 'react-router-dom';
import { Routes, Route, useNavigate, Outlet} from 'react-router-dom';

function App() {

  return (
    <div className="App">

      <Navbar/>

      <Routes>
        <Route path="/" element={<Input/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>

      <div className='content'>

        <div className='board'>
          <h1 className='board-category'>server</h1>
          <table>
            <thead>
              <th>id</th>
              <th>title</th>
              <th>date</th>
            </thead>
            <tbody>
              <tr>
                <td className='board-id'>id1</td>
                <td className='board-title'><a href='*'>tasdfale1</a></td>
                <td className='board-date'>date1</td>
              </tr>
              <tr>
                <td className='board-id'>id1</td>
                <td className='board-title'><a href='*'>tasdfale1</a></td>
                <td className='board-date'>date1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button onClick={()=>{
            fetch("http://172.30.1.48:8080/hello3")
            .then((res)=>res.text())
            .then((result)=>console.log(result));
          }}>hi</button>

          <button onClick={()=>{
            fetch("http://172.30.1.48:8080/hello2", {
              method: "POST",
              body: JSON.stringify({
                email: "id",
                password: "pw"
              })
            })
            .then((result) => console.log(result));
          }}>POST</button>
      </div>
    </div>
  );
}

function Navbar(){
  let navigate = useNavigate();
  return(
    <div className='header'>
      <div className='navbar'>
        <a className='navbar-logo' onClick={()=>{navigate('/')}}>Fire Sea</a>
        <a className='navbar-item' onClick={()=>{navigate('/server')}}>server</a>
        <a className='navbar-item' onClick={()=>{navigate('/front')}}>front</a>
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

function Error(){

  return(
    <div>err</div>
  )
}

export default App;
