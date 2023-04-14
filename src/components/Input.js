import { useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { changeSearchOption, changeSearchContent } from "../store";
import { useNavigate } from "react-router-dom";
import '../styles/Input.css'

function Input(){
  const localSettingTheme = localStorage.getItem('theme');
  const ip = useSelector((state)=>{return state.ip})
  const dispatch = useDispatch();
  const searchData = useSelector((state)=>{return state.searchData});
  const navigate = useNavigate();
  const [data, setData] = useState('');
  const [isFocus, setIsFocus] = useState(null);

  const onInput = (e)=>{
    const value = e.target.value;
    setData(value);
    dispatch(changeSearchContent(value))
  }
  const onClick = async (e)=>{
    if(data){
      // navigate('/list/search/result/0');
      
      (async ()=>{
        console.log('search data 요청중')
        console.log(searchData)
        const response = await axios.post(`http://${ip}/search2?page=0`, searchData);
        
        console.log(response);
      })()
    }
    else{
      alert('검색할 내용을 입력해주세요.');
    }
  }
  const onFocus = ()=>{
    setIsFocus('focus')
  }
  const onBlur = ()=>{
    setIsFocus(null)
  }
  return(
    <div className={'search search-'+localSettingTheme}>
      <div className={'search-container '+ isFocus}>
        <select name="type" className="search-select" onChange={(e)=>{dispatch(changeSearchOption(e.target.value))}}>
          <option value="textMessage" default>글정보</option>
          <option value="nickname">작성자</option>
        </select>
        <input type='text' className='search-input' placeholder='검색어를 입력하세요' onInput={onInput} onFocus={onFocus} onBlur={onBlur}/>
        <button className='search-btn' onClick={onClick}>검색</button>
      </div>
    </div>
  )
}

export {Input}