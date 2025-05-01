import { SIZE } from '@/configs'
import { TileProps } from '@/types'
import Message from '../Message'
import Tile from '../Tile'
import classes from './Board.module.scss'

type BoardProps = {
  tiles: TileProps[]
  won: boolean
  gameOver: boolean
  resetGame: () => void
  continueGame: () => void
}

export default function Board({ tiles, won, gameOver, resetGame, continueGame }: BoardProps) {
  return (
    <div className={classes.container}>
      {(gameOver || won) && <Message won={won} resetGame={resetGame} continueGame={continueGame} />}

      <div className={classes.tiles}>
        {tiles.map((tile: TileProps, index) => (
          <Tile key={index} {...tile} />
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
