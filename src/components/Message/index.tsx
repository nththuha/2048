import { use2048Game } from '@/hooks/use2048Game'
import { Button, Text } from '@mantine/core'
import classes from './Message.module.scss'

export default function Message() {
  const { won, resetGame, continueGame } = use2048Game()

  return (
    <div className={classes.container}>
      <Text className={classes.text}>{won ? 'You win!' : 'Game over!'}</Text>

      <Button size="md" fw="bold" onClick={won ? continueGame : resetGame}>
        {won ? 'Keep going' : 'Try again'}
      </Button>
    </div>
  )
}
