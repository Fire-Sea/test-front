import '../styles/Game.css'
import { useState } from 'react';

function Game(){
  let [answer, setAnswer] = useState('');
  let [guess, setGuess] = useState('');
  let [chance, setChance] = useState(5);
  let onChange = (e)=>{
    setGuess(e.target.value);
  }
  let onClick = (e)=>{
    if(guess){
      if(guess > answer){
        alert('DOWN!')
        setChance(chance-1)
      }
      else if(guess < answer){
        alert('UP!')
        setChance(chance-1)
      }
      else if(guess == answer){
        alert(`정답! ${6-chance}번만에 맞추셨군요!`)
        setChance(5)
      }
      else{
        alert('저런... 게임에서 지셨습니다.');
        setChance(5)
      }
    }
    else{
      alert('정답을 입력해주세요!')
    }
  }
  let createNum = (e)=>{
    const answer = Math.floor(Math.random()*101);
    setAnswer(answer);
    alert(answer)
    e.target.style.display = 'none';
  }
  return(
    <>
      <h1>Up & Down</h1>
      <div className='game-container'>
        <p>Up & Down 게임은 컴퓨터가 정한 수를 플레이어가 맞추는 게임입니다.</p>
        <p>플레이어는 특정 수를 외치고, 컴퓨터는 이 수가 정답보다 작으면 'Down', 크면 'Up'을 외칩니다.</p>
        <p>숫자는 1부터 100까지이며 정답을 외칠 수 있는 기회는 5번입니다.</p>
        <button onClick={(e)=>{createNum(e); }}>시작</button>
        <p>현재 남은 횟수: {chance}번</p>
        <div><input onChange={onChange}></input></div>
        <button onClick={onClick}>정답 제출하기</button>
      </div>
    </>
  )
}
export {Game}