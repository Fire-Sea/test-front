import { useState } from "react"
import axios from 'axios'
import { useSelector } from "react-redux";

function SNSRegister(){
  const [nickname, setNickname] = useState('');
  const [valid, setValid] = useState(false);
  const ip = useSelector(state => {return state.ip})
  return(
    <>
      <div>
        <div className="register-container">
          <h1>네이버로 회원가입</h1>
          <p>닉네임</p>
          <input className="register-id" id="registerNickname" type="text" placeholder="닉네임" onChange={(e)=>{setNickname(e.target.value)}}/>
          <button className="nickname-chk" onClick={()=>{
            if(nickname){
              axios.get(`http://${ip}/api/nicknameCheck?nickname=${nickname}`)
                .then(res=>{
                  res = res.data;
                  if(res.statusCode === 20004){
                    alert('사용 가능한 닉네임입니다.');
                    setValid(true);
                  }
                  else{
                    alert('이미 사용중인 닉네임입니다.');
                    setValid(false);
                  }
                })
            }
            else{
              alert('닉네임을 입력하세요.')
            }
          }}>중복체크</button>
          <button className="register-registerBtn" onClick={()=>{
            if(valid){
              alert('회원가입 완료')
            }
            else{
              alert('닉네임 중복체크를 확인하세요.')
            }
          }}>회원가입 하기</button>
        </div>
      </div>
    </>
  )
}
export {SNSRegister}