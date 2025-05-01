import { INITIAL_TILES, SIZE, SWIPE_THRESHOLD, WINNING_TILE } from '@/configs'
import { BoardProps, Direction, NullNumber, Position, TileProps } from '@/types'
import { useHotkeys } from '@mantine/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function use2048Game() {
  const addRandomTile = useCallback((board: BoardProps): TileProps | null => {
    const emptyTiles = board
      .flatMap((row, i) => row.map((cell, j) => (cell === null ? [i, j] : null)).filter(Boolean))
      .filter(Boolean) as Position[]
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
      const value = Math.random() < 0.9 ? 2 : 4
      board[row][col] = value
      return { id: uuidv4(), position: [row, col], value }
    }
    return null
  }, [])

  const initialize = useCallback(() => {
    const newBoard: BoardProps = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
    const initialTiles: TileProps[] = []
    Array.from({ length: INITIAL_TILES }).forEach(() => {
      const tile = addRandomTile(newBoard)
      if (tile) {
        initialTiles.push(tile)
      }
    })
    return { board: newBoard, tiles: initialTiles }
  }, [addRandomTile])

  const [board, setBoard] = useState<BoardProps>(initialize().board)
  const [tiles, setTiles] = useState<TileProps[]>(initialize().tiles)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [won, setWon] = useState<boolean>(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const transpose = useCallback((board: BoardProps) => {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
  }, [])

  const canMove = useCallback((board: BoardProps) => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === null) {
          return true
        }
        if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) {
          return true
        }
        if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) {
          return true
        }
      }
    }
    return false
  }, [])

  const move = useCallback(
    (direction: Direction) => {
      if (gameOver || won) {
        return
      }

      let newBoard = board.map((row) => [...row])
      let newScore = score
      let moved = false
      const newMergedTiles: Position[] = []

      if (direction === 'up' || direction === 'down') {
        newBoard = transpose(newBoard)
      }
      if (direction === 'down' || direction === 'right') {
        newBoard = newBoard.map((row) => row.reverse())
      }

      for (let i = 0; i < SIZE; i++) {
        const row = newBoard[i].filter((val) => val !== null)
        const newRow: NullNumber[] = []
        let j = 0
        while (j < row.length) {
          if (j + 1 < row.length && row[j] === row[j + 1]) {
            const merged = row[j] ? row[j]! * 2 : null
            newRow.push(merged)
            newScore += merged!
            let mergeRow = i
            let mergeCol = newRow.length - 1
            if (direction === 'down' || direction === 'right') {
              mergeCol = SIZE - 1 - mergeCol
            }
            if (direction === 'up' || direction === 'down') {
              const originalRow = mergeRow
              mergeRow = mergeCol
              mergeCol = originalRow
            }
            newMergedTiles.push([mergeRow, mergeCol])
            if (merged === WINNING_TILE) {
              setWon(true)
            }
            j += 2
          } else {
            newRow.push(row[j])
            j++
          }
        }
        while (newRow.length < SIZE) {
          newRow.push(null)
        }
        if (newBoard[i].join() !== newRow.join()) {
          moved = true
        }
        newBoard[i] = newRow
      }

      if (direction === 'down' || direction === 'right') {
        newBoard = newBoard.map((row) => row.reverse())
      }
      if (direction === 'up' || direction === 'down') {
        newBoard = transpose(newBoard)
      }

      if (moved) {
        addRandomTile(newBoard)
        setBoard(newBoard)
        setScore(newScore)
        setBestScore(Math.max(newScore, bestScore))
        if (!canMove(newBoard)) {
          setGameOver(true)
        }
        setTimeout(() => {}, 200)
      }
    },
    [addRandomTile, bestScore, board, canMove, gameOver, score, transpose, won],
  )

  useHotkeys([
    ['ArrowUp', () => move('up')],
    ['ArrowDown', () => move('down')],
    ['ArrowLeft', () => move('left')],
    ['ArrowRight', () => move('right')],
  ])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) {
        return
      }

      const touch = e.changedTouches[0]
      const touchEnd = { x: touch.clientX, y: touch.clientY }
      const deltaX = touchEnd.x - touchStartRef.current.x
      const deltaY = touchEnd.y - touchStartRef.current.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > SWIPE_THRESHOLD) {
          move('right')
        } else if (deltaX < -SWIPE_THRESHOLD) {
          move('left')
        }
      } else {
        if (deltaY > SWIPE_THRESHOLD) {
          move('down')
        } else if (deltaY < -SWIPE_THRESHOLD) {
          move('up')
        }
      }

      touchStartRef.current = null
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [move])

  const resetGame = useCallback(() => {
    setBoard(initialize().board)
    setTiles(initialize().tiles)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }, [initialize])

  const continueGame = useCallback(() => {
    setWon(false)
    setGameOver(false)
  }, [])

  return {
    board,
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    resetGame,
    continueGame,
  }
}
