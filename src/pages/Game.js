import '../styles/Game.css'

function Game(){
  return(
    <>
      <h1>Up & Down</h1>
      <div className='game-container'>
        <p>Up & Down 게임은 컴퓨터가 정한 수를 플레이어가 맞추는 게임입니다.</p>
        <p>플레이어는 특정 수를 외치고, 컴퓨터는 이 수가 정답보다 작으면 'Down', 크면 'Up'을 외칩니다.</p>
        <p>숫자는 1부터 100까지이며 정답을 외칠 수 있는 기회는 5번입니다.</p>
      </div>
    </>
  )
}
export {Game}