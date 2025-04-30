import { SIZE } from '@/configs'
import { use2048Game } from '@/hooks/use2048Game'
import { TileProps } from '@/types'
import Message from '../Message'
import Tile from '../Tile'
import classes from './Board.module.scss'

export default function Board() {
  const { won, gameOver } = use2048Game()

  return (
    <div className={classes.container}>
      {(gameOver || won) && <Message />}
      <div className={classes.tiles}>
        {temp.map((tile: TileProps, index) => (
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

const temp: TileProps[] = [
  { position: [0, 0], value: 2 },
  { position: [1, 0], value: 4 },
  { position: [1, 1], value: 8 },
]
