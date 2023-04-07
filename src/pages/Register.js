import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import '../styles/Register.css';
import useSendUserInfo from '../hooks/useSendUserInfo';

function Register(){
  const ip = useSelector((state) => {return state.ip});
  const [fade, setFade] = useState('');
  const [validList, setValidList] = useState([0,0,0,0])
  const [registerData, setResgisterData] = useState({
    email: '',
    username: '',
    password: '',
    nickname: ''
  });

  // 가입 정보 POST하는 hook
  const {sendUserInfo} = useSendUserInfo(registerData);

  const onChange = (e)=>{
    const type = e.target.name;
    const value = e.currentTarget.value;
    const warning = e.currentTarget.nextSibling;
    console.log(registerData)
    let reg = '';
    let msg = '';
    let cnt = 0;
    if(type === 'email'){
      reg = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
      msg = '올바른 이메일 형식이 아닙니다.';
    }
    else{
      reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      msg = '비밀번호는 최소 8자리이며 특수문자를 포함해야 합니다.';
      cnt = 2;
    }

    if(!reg.test(value)){
      warning.innerHTML = msg;
      e.currentTarget.classList.remove('verified');
      e.currentTarget.classList.add('warning');

      let copy = [...validList]
      copy[cnt] = 0;
      setValidList(copy)
    }
    else{
      warning.innerHTML = ' ';
      e.currentTarget.classList.remove('warning');
      e.currentTarget.classList.add('verified');

      let copy = [...validList]
      copy[cnt] = 1;
      setValidList(copy)

      setResgisterData({
        ...registerData,
        [type]: value
      })
    }
  }

  useEffect(()=>{
    const fadeTimer = setTimeout(()=>setFade('end'), 100);
    return ()=>{
      clearTimeout(fadeTimer);
      setFade('');
    }
  }, [])

  return(
  <>
  <div className={'register-container start ' + fade}>
    <h1>회원가입</h1>
    <p>이메일</p>
    <input className='register-email' id='registerEmail' type={'email'} placeholder='example@any.com' onChange={onChange} name='email'/>
    <p className='valid-fail' id='email-chk'></p>
    <p>아이디</p>
    <input className='register-id' id='registerId' type={'text'} placeholder='아이디'/>
    <button className='id-chk' onClick={()=>{
      let usernameBox = document.querySelector('#registerId');
      let username = usernameBox.value;
      let warning = document.querySelector('#id-chk');
      let type = 'username'
      axios.get(`http://${ip}/api/idCheck?username=${username}`)
        .then(res=>{
          res = res.data;
          if(res.statusCode === 20003){
            warning.classList.add('valid-success');
            warning.innerHTML = '사용 가능한 아이디입니다.';
            usernameBox.style.border = '1px solid blue';
            let copy = [...validList]
            copy[1] = 1;
            setValidList(copy)

            setResgisterData({
              ...registerData,
              [type]: username
            })
          }
          else if(res.statusCode === 40003){
            warning.classList.remove('valid-success');
            warning.innerHTML = '해당 아이디는 이미 사용중입니다.';
            usernameBox.style.border = '3px solid red';
            let copy = [...validList]
            copy[1] = 0;
            setValidList(copy)
          }
          else{
            alert('서버가 일을 안해요');
          }
        })
    }}>중복체크</button>
    <p className='valid-fail' id='id-chk'></p>
    <p>비밀번호</p>
    <input className='register-passwd' id='registerPasswd' type={'password'} placeholder='비밀번호' onChange={onChange} name='password'/>
    <p className='valid-fail' id='passwd-chk'></p>
    <p>닉네임</p>
    <input className='register-id' id='registerNickname' type={'text'} placeholder='닉네임'/>
    <button className='nickname-chk' onClick={()=>{
      let nicknameBox = document.querySelector('#registerNickname');
      let nickname = nicknameBox.value;
      let warning = document.querySelector('#nickname-chk');
      let type='nickname'
      axios.get(`http://${ip}/api/nicknameCheck?nickname=${nickname}`)
        .then(res=>{
          res = res.data;
          if(res.statusCode === 20004){
            warning.classList.add('valid-success');
            warning.innerHTML = '사용 가능한 닉네임입니다.';
            nicknameBox.style.border = '1px solid blue';
            let copy = [...validList]
            copy[3] = 1;
            setValidList(copy)
            setResgisterData({
              ...registerData,
              [type]: nickname
            })
          }
          else if(res.statusCode === 40004){
            warning.classList.remove('valid-success');
            warning.innerHTML = '해당 닉네임은 이미 사용중입니다.';
            nicknameBox.style.border = '3px solid red';
            let copy = [...validList]
            copy[3] = 0;
            setValidList(copy)
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
        setResgisterData({
          email: email,
          username: username,
          password: password,
          nickname: nickname
        });

        sendUserInfo('register');
      }
    }}>회원가입 하기</button>

    
  </div>
  </>
  )
}

export {Register}