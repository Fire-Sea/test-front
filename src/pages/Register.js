import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from 'axios'

function Register(){
    let ip = useSelector((state) => {return state.ip});

    let navigate = useNavigate();
    let validList = [0,0,0,0];
    return(
    <>
    <div className='register-container'>
      <h1>회원가입</h1>
      <p>이메일</p>
      <input className='register-email' id='registerEmail' type={'email'} placeholder='example@any.com' onChange={(e)=>{
        let value = e.currentTarget.value;
        let warning = document.querySelector('#email-chk');
        if(!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)){
          warning.innerHTML = '올바른 이메일 형식이 아닙니다.'
          validList[0] = 0;
        }
        else{
          warning.innerHTML = ' '
          validList[0] = 1;
        }
      }}/>
      <p className='valid-fail' id='email-chk'></p>
      <p>아이디</p>
      <input className='register-id' id='registerId' type={'text'} placeholder='아이디'/>
      <button className='id-chk' onClick={()=>{
        let username = document.querySelector('#registerId').value;
        let warning = document.querySelector('#id-chk');
        fetch(`http://${ip}/api/idCheck?username=${username}`)
        .then(res=>res.json())
        .then(res=>{
          if(res.statusCode === 20003){
            warning.classList.add('valid-success');
            warning.innerHTML = '사용 가능한 아이디입니다.';
            validList[1] = 1;
          }
          else if(res.statusCode === 40003){
            warning.classList.remove('valid-success');
            warning.innerHTML = '해당 아이디는 이미 사용중입니다.';
            validList[1] = 0;
          }
          else{
            alert('서버가 일을 안해요');
          }
        })
      }}>중복체크</button>
      <p className='valid-fail' id='id-chk'></p>
      <p>비밀번호</p>
      <input className='register-passwd' id='registerPasswd' type={'password'} placeholder='비밀번호' onChange={(e)=>{
        let value = e.currentTarget.value;
        let warning = document.querySelector('#passwd-chk');
        if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value)){
          warning.innerHTML = '비밀번호는 최소 8자리이며 특수문자를 포함해야 합니다.';
          validList[2] = 0;
        }
        else{
          warning.innerHTML = ' ';
          validList[2] = 1;
        }
      }}/>
      <p className='valid-fail' id='passwd-chk'></p>
      <p>닉네임</p>
      <input className='register-id' id='registerNickname' type={'text'} placeholder='닉네임'/>
      <button className='nickname-chk' onClick={()=>{
        let nickname = document.querySelector('#registerNickname').value;
        let warning = document.querySelector('#nickname-chk');
        fetch(`http://${ip}/api/nicknameCheck?nickname=${nickname}`)
        .then(res=>res.json())
        .then(res=>{
          if(res.statusCode === 20004){
            warning.classList.add('valid-success');
            warning.innerHTML = '사용 가능한 닉네임입니다.';
            validList[3] = 1;
          }
          else if(res.statusCode === 40004){
            warning.classList.remove('valid-success');
            warning.innerHTML = '해당 닉네임은 이미 사용중입니다.';
            validList[3] = 0;
          }
          else{
            alert('서버가 일을 안해요');
          }
        })
      }}>중복체크</button>
      <p className='valid-fail' id='nickname-chk'></p>
      <button className='register-registerBtn' onClick={()=>{
        let email = document.querySelector('#registerEmail').value;
        let username = document.querySelector('#registerId').value;
        let password = document.querySelector('#registerPasswd').value;
        let nickname = document.querySelector('#registerNickname').value;
        
        if(!validList[0]){
          alert('이메일을 확인하세요.');
        }
        else if(!validList[1]){
          alert('아이디 중복을 확인하세요.');
        }
        else if(!validList[2]){
          alert('비밀번호를 확인하세요.');
        }
        else if(!validList[3]){
          alert('닉네임 중복을 확인하세요.');
        }
        else{
          fetch(`http://${ip}/api/register`, {
          method: "POST",
          headers:{
            "content-type" : "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
            nickname: nickname
          })
        })
          .then(res=>res.json())
          .then(data=>{
            if(data.statusCode === 40001){
              alert(data.responseMessage);
            }
            else{
              alert('성공적으로 회원가입 되었습니다.');
              navigate('/');
            }
          })
          .catch(err=>console.log(err));
          console.log(`id: ${username} / email: ${email} / passwd: ${password} / nickname: ${nickname}`);
        }
        
        
      }}>회원가입 하기</button>

      <button onClick={()=>{
        axios.post('http://localhost:8080/post2',
        {
          body: {
            name: 'nameim',
            age: 'ageim'
          }
        })
      }}>axios post test</button>

      <button onClick={()=>{
        fetch('http://localhost:8080/post2', {
          method: 'POST',
          body: JSON.stringify({
            name: 'nameim',
            age: 'ageim'
          })
        })
      }}>fetch post test</button>
    </div>
    </>
    )
  }

  export {Register}