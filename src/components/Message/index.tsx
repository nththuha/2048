import { Button, Text } from '@mantine/core'
import classes from './Message.module.scss'

type MessageProps = {
  won: boolean
  resetGame: () => void
  continueGame: () => void
}

export default function Message({ won, resetGame, continueGame }: MessageProps) {
  return (
    <div className={classes.container}>
      <Text className={classes.text}>{won ? 'You win!' : 'Game over!'}</Text>

      <Button size="md" fw="bold" onClick={won ? continueGame : resetGame}>
        {won ? 'Keep going' : 'Try again'}
      </Button>
    </div>
  )
}
