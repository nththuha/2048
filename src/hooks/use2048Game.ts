import { INITIAL_TILES, SIZE, SWIPE_THRESHOLD, WINNING_TILE } from '@/configs'
import { BoardProps, Direction, Position, TileProps } from '@/types'
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
      return { id: uuidv4(), currentPosition: [row, col], value, isMerged: false, isRemoved: false }
    }
    return null
  }, [])

  const initialize = useCallback(() => {
    const board: BoardProps = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
    const tiles: Record<string, TileProps> = {}
    Array.from({ length: INITIAL_TILES }).forEach(() => {
      const tile = addRandomTile(board)
      if (tile) {
        board[tile.currentPosition[0]][tile.currentPosition[1]] = tile.id
        tiles[tile.id] = tile
      }
    })
    return { board, tiles }
  }, [addRandomTile])

  const initialState = useRef(initialize()).current
  const [board, setBoard] = useState<BoardProps>(initialState.board)
  const [tiles, setTiles] = useState<Record<string, TileProps>>(initialState.tiles)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
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
      const newTiles: Record<string, TileProps> = {}

      if (direction === 'up' || direction === 'down') {
        newBoard = transpose(newBoard)
      }
      if (direction === 'down' || direction === 'right') {
        newBoard = newBoard.map((row) => row.reverse())
      }

      for (let i = 0; i < SIZE; i++) {
        const row = newBoard[i].filter((val) => val !== null) as string[]
        const newRow: (string | null)[] = []
        let j = 0
        let colIndex = 0

        while (j < row.length) {
          if (j + 1 < row.length && tiles[row[j]]?.value === tiles[row[j + 1]]?.value) {
            const mergedValue = tiles[row[j]].value * 2
            const newTileId = uuidv4()
            newScore += mergedValue

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

            newTiles[newTileId] = {
              id: newTileId,
              currentPosition: [mergeRow, mergeCol],
              value: mergedValue,
              isMerged: true,
              isRemoved: false,
            }

            const tileId1 = row[j]
            newTiles[tileId1] = {
              ...tiles[tileId1],
              currentPosition: [mergeRow, mergeCol],
              previousPosition: tiles[tileId1].currentPosition,
              isMerged: false,
              isRemoved: true,
            }

            const tileId2 = row[j + 1]
            newTiles[tileId2] = {
              ...tiles[tileId2],
              previousPosition: tiles[tileId2].currentPosition,
              currentPosition: [mergeRow, mergeCol],
              isMerged: false,
              isRemoved: true,
            }

            newRow.push(newTileId)
            if (mergedValue === WINNING_TILE) {
              setWon(true)
            }
            j += 2
            colIndex++
          } else {
            const tileId = row[j]
            newRow.push(tileId)
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
            newTiles[tileId] = {
              ...tiles[tileId],
              previousPosition: tiles[tileId].currentPosition,
              currentPosition: [tileRow, tileCol],
              isMerged: false,
              isRemoved: false,
            }
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
          newBoard[newTile.currentPosition[0]][newTile.currentPosition[1]] = newTile.id
          newTiles[newTile.id] = { ...newTile, isMerged: false, isRemoved: false }
        }

        setBoard(newBoard)
        setTiles(newTiles)
        setScore(newScore)
        setBestScore(Math.max(newScore, bestScore))
        if (!canMove(newBoard)) {
          setGameOver(true)
        }

        // setTimeout(() => {
        //   setTiles((prev) => {
        //     const updatedTiles = { ...prev }
        //     Object.keys(updatedTiles).forEach((tileId) => {
        //       if (updatedTiles[tileId].isRemoved) {
        //         delete updatedTiles[tileId]
        //       }
        //     })
        //     return updatedTiles
        //   })
        // }, MOVE_ANIMATION_DURATION)
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
