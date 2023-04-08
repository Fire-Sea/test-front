import '../styles/Banner.css';

function Banner(){

    return(
      <>
      <div className='banner-l' onClick={()=>{window.open('https://genshin.hoyoverse.com/ko')}}>
        <div className='banner-container'>
          <div className='banner-face face-front'>
            <h3>원신 삼대장</h3>
            <img width={'100%'} alt='banner1-1' src={process.env.PUBLIC_URL + '/banner5.webp'} style={{'marginTop':'100px'}}/>
            <p>카미사토 아야카</p>
          </div>
          <div className='banner-face face-left'>
            <h3>원신 삼대장</h3>
            <img width={'100%'} alt='banner2-1' src={process.env.PUBLIC_URL + '/banner6.webp'} style={{'marginTop':'100px'}}/>
            <p>파루잔</p>
          </div>
          <div className='banner-face face-right'>
            <h3>원신 삼대장</h3>
            <img width={'100%'} alt='banner3-1' src={process.env.PUBLIC_URL + '/banner7.webp'} style={{'marginTop':'100px'}}/>
            <p>산고노미야 코코미</p>
          </div>
        </div>
      </div>

      <div className='banner-r' onClick={()=>{window.open('https://www.pledis.co.kr/html/artist/fromisnine/KOR/profile')}}>
        <div className='banner-container'>
          <div className='banner-face face-front'>
            <h3>프로미스나인</h3>
            <img width={'100%'} alt='banner1-1' src={process.env.PUBLIC_URL + '/banner1-1.webp'}/>
            <p>누군지 몰루1</p>
            <img width={'100%'} alt='banner1-2' src={process.env.PUBLIC_URL + '/banner1-2.webp'}/>
            <p>누군지 몰루2</p>
          </div>
          <div className='banner-face face-left'>
            <h3>프로미스나인</h3>
            <img width={'100%'} alt='banner2-1' src={process.env.PUBLIC_URL + '/banner2-1.webp'}/>
            <p>누군지 몰루3</p>
            <img width={'100%'} alt='banner2-2' src={process.env.PUBLIC_URL + '/banner2-2.webp'}/>
            <p>누군지 몰루4</p>
          </div>
          <div className='banner-face face-right'>
            <h3>프로미스나인</h3>
            <img width={'100%'} alt='banner3-1' src={process.env.PUBLIC_URL + '/banner3-1.webp'}/>
            <p>누군지 몰루5</p>
            <img width={'100%'} alt='banner3-2' src={process.env.PUBLIC_URL + '/banner3-2.webp'}/>
            <p>누군지 몰루6</p>
          </div>
        </div>
      </div>
      </>
    )
}

export {Banner};