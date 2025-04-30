import { use2048Game } from '@/hooks/use2048Game'
import { Button } from '@mantine/core'

export default function NewGameButton() {
  const { resetGame } = use2048Game()

  return (
    <Button fullWidth size="md" fw="bold" onClick={resetGame}>
      New Game
    </Button>
  )
}
