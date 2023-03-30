import { useEffect, useState } from 'react';
import '../styles/Gacha.css'

function Gacha(){
  useEffect(()=>{
    setVideo(document.querySelector('.gacha-video'))
  }, [])
  let gachaBoard = document.querySelector('.gacha-result');
  let [video, setVideo] = useState('');
  let gachaResult = [];

  let gachaData = {
    rank5: 0.006,
    rank4: 0.051,
    gachaCnt: 0,
  }

  // 가챠 영상 출력
  const playVid = (url)=>{
    video.src = url;
    video.style.display = 'block'
    video.play();
    video.onended = ()=>{
      video.style.display = 'none';
    }
  }
  
  // 10연챠 함수
  const gacha10 = ()=>{
    gachaResult = [];
    let url = '';
    for(let i=0; i<10; i++){
      gacha();
    }
    // 높은 등급순으로 정렬
    gachaResult = gachaResult.sort((a,b)=>{
      if(a.rank > b.rank) return -1;
      if(a.rank < b.rank) return 1;
      return 0;
    })

    // 가챠 연출 결정 및 재생
    if(gachaResult[0].rank === 'rank5'){
      url = `${process.env.PUBLIC_URL}./5starwish.mp4`;
    }
    else{
      url = `${process.env.PUBLIC_URL}./4starwish.mp4`;
    }
    playVid(url)

    gachaBoard.innerHTML = '';
    
    // 가챠 아이템 출력 
    // 연출이 끝나기 전 출력되는걸 방지하기 위해 타이머 설정
    setTimeout(()=>{
      for(let i=0; i<10; i++){
        let template = `<div class='hi ${gachaResult[i].rank}'><p>${gachaResult[i].name}</p></div>`;
        gachaBoard.insertAdjacentHTML('beforeend', template);
      }
    }, 500)
  }

  // 단챠 함수
  const gacha = ()=>{
    const result = Math.random();
    gachaData.gachaCnt += 1;
    
    // 천장(5성)
    if(gachaData.gachaCnt === 90){
      gachaResult.push({
        rank: 'rank5',
        name: '⭐⭐⭐⭐⭐'
      });
      gachaData.rank5 = 0.006;
      gachaData.gachaCnt = 0;
    }
    // 천장 아닐떄
    else{
      // 74번째부터 5성 확률업
      if(gachaData.gachaCnt > 73){
        gachaData.rank5 += 0.006;
      }
      // 10번 가챠시 4성 한개 확정
      if(gachaData.gachaCnt % 10 === 0){
        gachaResult.push({
          rank: 'rank4',
          name: '⭐⭐⭐⭐'
        });
        return
      }
      // 천장(5성)도 아니고 10n번째 가챠도 아닐때
      // 난수 비교로 등급 판별
      compare(result);
    }
  }

  // 난수 비교 및 등급 판별함수
  const compare = (result)=>{
    // 5성
    if(result <= gachaData.rank5){
      gachaResult.push({
          rank: 'rank5',
          name: '⭐⭐⭐⭐⭐'
        });
      gachaData.rank5 = 0.006;
      gachaData.gachaCnt = 0;
    }
    // 4성
    else if(result <= gachaData.rank4){
      gachaResult.push({
          rank: 'rank4',
          name: '⭐⭐⭐⭐'
        });
    }
    // 3성
    else{
      gachaResult.push({
          rank: 'rank3',
          name: '⭐⭐⭐'
        });
    }
  }

  return(
    <>
      <div className="gacha-container">
        <video className="gacha-video" src={process.env.PUBLIC_URL + '/4starwish.mp4'} 
        playsInline muted  autoPlay/>
        <div className="gacha-result">
        </div>
      </div>
      <div className='gacha-btns'>
        <button onClick={gacha}>단차 테스트</button>
        <button className='gacha-10' onClick={gacha10}>10연차 테스트</button>
      </div>
    </>
  )
}

export {Gacha};