import { Stack } from '@mantine/core'
import Board from '../Board'
import Footer from '../Footer'
import Header from '../Header'
import Instruction from '../Instruction'
import NewGameButton from '../NewGameButton'
import Score from '../Score'
import classes from './GameView.module.scss'

export default function GameView() {
  return (
    <Stack className={classes.container}>
      <Stack className={classes.content}>
        <Header />
        <Score />
        <NewGameButton />
        <Instruction />
        <Board />
        <Footer />
      </Stack>
    </Stack>
  )
}
