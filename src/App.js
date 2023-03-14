import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <div className='header'>
        <div className='navbar'>
          <h1>Fire Sea</h1>
          <a>server</a>
          <a>front</a>
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
    </div>
  );
}

export default App;
