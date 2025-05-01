import { use2048Game } from '@/hooks/use2048Game'
import { Stack } from '@mantine/core'
import Board from '../Board'
import Footer from '../Footer'
import Header from '../Header'
import Instruction from '../Instruction'
import NewGameButton from '../NewGameButton'
import Score from '../Score'
import classes from './GameView.module.scss'

export default function GameView() {
  const { tiles, score, bestScore, gameOver, won, resetGame, continueGame } = use2048Game()

  return (
    <Stack className={classes.container}>
      <Stack className={classes.content}>
        <Header />
        <Score score={score} bestScore={bestScore} />
        <NewGameButton onClick={resetGame} />
        <Instruction />
        <Board
          tiles={tiles}
          won={won}
          gameOver={gameOver}
          resetGame={resetGame}
          continueGame={continueGame}
        />
        <Footer />
      </Stack>
    </Stack>
  )
}
