import { Input } from '../Input';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Edit({ip, loginInfo}){
    let navigate = useNavigate();
    let {category} = useParams();
    console.log('지금 로그인된 닉네임 : ' + loginInfo)
    return(
      <>
        <Input/>
        <div className='edit-container'>
          <input className='edit-title' placeholder='제목을 입력하세요'/>
          <textarea className='edit-body' autoComplete='no' placeholder='내용을 작성하세요'/>
          <div className='edit-btn'>
            <button className='edit-cancel' onClick={()=>{navigate(-1)}}>취소</button>
            <button className='edit-send' onClick={()=>{
              let textTitle = document.querySelector('.edit-title').value;
              let textBody = document.querySelector('.edit-body').value;
              if(!textTitle){
                alert('제목을 입력하세요');
              }
              else if(!textBody){
                alert('내용을 입력하세요');
              }
              else{
                fetch(`http://${ip}/api/send`, {
                  method: "POST",
                  headers:{
                    "content-type" : "application/json"
                  },
                  body: JSON.stringify({
                    category: category,
                    nickname: loginInfo,
                    textTitle: textTitle,
                    textBody: textBody
                  })
                })
                  .then(res=>res.json())
                  .then((res)=>{
                    
                    if(parseInt(res.statusCode) === 20000){
                       alert('글이 저장되었습니다.');
                       navigate(`/${category}/list`);
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

  export {Edit};