function Input(){
  const localSettingTheme = localStorage.getItem('theme');
    return(
      <div className={'search search-'+localSettingTheme}>
        <div className='search-container'>
          <input className='search-input' placeholder='검색어를 입력하세요'/>
          <button className='search-btn'>검색</button>
        </div>
      </div>
    )
  }

export {Input}