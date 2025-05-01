import { Button } from '@mantine/core'

type NewGameButtonProps = {
  onClick: () => void
}

export default function NewGameButton({ onClick }: NewGameButtonProps) {
  return (
    <Button fullWidth size="md" fw="bold" onClick={onClick}>
      New Game
    </Button>
  )
}
