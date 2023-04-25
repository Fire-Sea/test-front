function SNSRegister(){
  return(
    <>
      <div>
        <div className="register-container">
          <h1>네이버로 회원가입</h1>
          <p>닉네임</p>
          <input className="register-id" id="registerNickname" type="text" placeholder="닉네임"/>
          <button className="nickname-chk">중복체크</button>
          <button className="register-registerBtn">회원가입 하기</button>
        </div>
      </div>
    </>
  )
}
export {SNSRegister}