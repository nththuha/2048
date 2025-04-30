import { useCallback, useState } from 'react'

export function use2048Game() {
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const resetGame = useCallback(() => {
    // TODO
  }, [])

  const continueGame = useCallback(() => {
    // TODO
  }, [])

  return {
    score,
    bestScore,
    gameOver,
    won,
    resetGame,
    continueGame,
  }
}
