import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { changeSearchOption, changeSearchContent, changeSearchFlag } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Input.css'

function Input(){
  const localSettingTheme = localStorage.getItem('theme');
  const ip = useSelector((state)=>{return state.ip})
  const dispatch = useDispatch();
  const searchData = useSelector((state)=>{return state.searchData});
  const navigate = useNavigate();
  const [data, setData] = useState('');
  const [isFocus, setIsFocus] = useState(null);
  const {type} = useParams();
  const localSearchData = JSON.parse(localStorage.getItem('searchData'))
  const onInput = (e)=>{
    const value = e.target.value;
    setData(value);
    dispatch(changeSearchContent(value))
  }
  const onClick = async (e)=>{
    const defaultContent = e.target.parentNode.children[1].value;
    const defaultOption = e.target.parentNode.children[0].value;

    if(data){
      console.log('정상적 검색')
      dispatch(changeSearchFlag(!searchData.flag))
      localStorage.setItem('searchData', JSON.stringify(searchData));
      navigate('/list/search/result/0');
    }
    else if(defaultContent != ''){
      console.log('새로고침으로 데이터 날아감')
      dispatch(changeSearchFlag(!searchData.flag))
      dispatch(changeSearchContent(defaultContent))
      dispatch(changeSearchOption(defaultOption))
      localStorage.setItem('searchData', JSON.stringify({
        ...searchData,
        ['content']: defaultContent,
        ['option']: defaultOption,
      }));
      navigate('/list/search/result/0');
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
  const onKeyUp = (e)=>{
    if(e.key == 'Enter'){
      e.preventDefault()
      e.target.nextSibling.click();
    }
  }
  useEffect(()=>{

  }, [searchData])
  return(
    <div className={'search search-'+localSettingTheme}>
      <div className={'search-container '+ isFocus}>
        <select name="type" className="search-select" onChange={(e)=>{dispatch(changeSearchOption(e.target.value))}}
        defaultValue={localSearchData != null ? localSearchData.option : 'textMessage'}>
          <option value="textMessage">글정보</option>
          <option value="nickname">작성자</option>
        </select>
        <input type='text' className='search-input' placeholder='검색어를 입력하세요' onInput={onInput}
        onKeyUp={onKeyUp} defaultValue={localSearchData != null ? localSearchData.content : ''}/>
        <button className='search-btn' onClick={onClick}>검색</button>
      </div>
    </div>
  )
}

export {Input}