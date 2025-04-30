import { SIZE } from '@/configs'
import { use2048Game } from '@/hooks/use2048'
import Message from '../Message'
import Tile from '../Tile'
import classes from './Board.module.scss'

export default function Board() {
  const { won, gameOver } = use2048Game()

  return (
    <div className={classes.container}>
      {(gameOver || won) && <Message />}
      <div className={classes.tiles}>
        {[].map((_, index) => (
          <Tile key={index} />
        ))}
      </div>
      <div className={classes.grid}>
        {Array.from({ length: SIZE * SIZE }, (_, index) => index).map((index) => (
          <div key={index} className={classes.cell} />
        ))}
      </div>
    </div>
  )
}
