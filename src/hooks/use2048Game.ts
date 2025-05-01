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

  const initialState = useRef(initialize()).current
  const [board, setBoard] = useState<BoardProps>(initialState.board)
  const [tiles, setTiles] = useState<TileProps[]>(initialState.tiles)
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
      const newTiles: TileProps[] = []
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
        let colIndex = 0
        while (j < row.length) {
          if (j + 1 < row.length && row[j] === row[j + 1]) {
            const merged = row[j] ? row[j]! * 2 : null
            newRow.push(merged)
            newScore += merged!
            let mergeRow = i
            let mergeCol = colIndex
            if (direction === 'down' || direction === 'right') {
              mergeCol = SIZE - 1 - mergeCol
            }
            if (direction === 'up' || direction === 'down') {
              const originalRow = mergeRow
              mergeRow = mergeCol
              mergeCol = originalRow
            }
            newTiles.push({
              id: uuidv4(),
              position: [mergeRow, mergeCol],
              value: merged!,
            })
            newMergedTiles.push([mergeRow, mergeCol])
            if (merged === WINNING_TILE) {
              setWon(true)
            }
            j += 2
            colIndex++
          } else {
            newRow.push(row[j])
            let tileRow = i
            let tileCol = colIndex
            if (direction === 'down' || direction === 'right') {
              tileCol = SIZE - 1 - tileCol
            }
            if (direction === 'up' || direction === 'down') {
              const originalRow = tileRow
              tileRow = tileCol
              tileCol = originalRow
            }
            const existingTile = tiles.find(
              (tile) =>
                tile.position[0] === tileRow &&
                tile.position[1] === tileCol &&
                tile.value === row[j],
            )
            newTiles.push({
              id: existingTile ? existingTile.id : uuidv4(),
              position: [tileRow, tileCol],
              value: row[j]!,
            })
            j++
            colIndex++
          }
        }
        while (newRow.length < SIZE) {
          newRow.push(null)
          colIndex++
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
        const newTile = addRandomTile(newBoard)
        if (newTile) {
          newTiles.push(newTile)
        }
        setBoard(newBoard)
        setTiles(newTiles)
        setScore(newScore)
        setBestScore(Math.max(newScore, bestScore))
        if (!canMove(newBoard)) {
          setGameOver(true)
        }
      }
    },
    [addRandomTile, bestScore, board, canMove, gameOver, score, tiles, transpose, won],
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
    const { board, tiles } = initialize()
    setBoard(board)
    setTiles(tiles)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }, [initialize])

  const continueGame = useCallback(() => {
    setWon(false)
    setGameOver(false)
  }, [])

  return {
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    resetGame,
    continueGame,
  }
}
