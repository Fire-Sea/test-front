import { Input } from '../Input';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import '../styles/Edit.css';

function Edit(){
    let navigate = useNavigate();
    let {category} = useParams();
    let ip = useSelector((state) => {return state.ip});
    let [fade, setFade] = useState('');

    useEffect(()=>{
      const fadeTimer = setTimeout(()=>{setFade('end')}, 100);
      return ()=>{
        clearTimeout(fadeTimer);
        setFade('')
      }
    }, [])
    
    return(
      <>
        <Input/>
        <div className={'edit-container start ' + fade}>
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
                axios.post(`http://${ip}/api/send`,{
                    category : category,
                    textTitle: textTitle,
                    textBody: textBody
                })
                  .then((res)=>{
                    console.log(res)
                    if(parseInt(res.data.statusCode) === 20000){
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