import { colors, GAP, MOVE_ANIMATION_DURATION, WIDTH } from '@/configs'
import { Position, TileProps } from '@/types'
import { Text } from '@mantine/core'
import { useEffect, useRef } from 'react'
import classes from './Tile.module.scss'

export default function Tile({
  currentPosition,
  previousPosition,
  value,
  isMerged = false,
}: TileProps) {
  const tileRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const positionToPixels = (position: number) => GAP / 2 + position * (WIDTH + GAP)

  useEffect(() => {
    if (areSamePosition(currentPosition, previousPosition)) {
      return
    }

    const startTop = positionToPixels(previousPosition![0])
    const startLeft = positionToPixels(previousPosition![1])
    const endTop = positionToPixels(currentPosition[0])
    const endLeft = positionToPixels(currentPosition[1])

    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / MOVE_ANIMATION_DURATION, 1)

      if (tileRef.current) {
        const currentTop = startTop + (endTop - startTop) * progress
        const currentLeft = startLeft + (endLeft - startLeft) * progress

        tileRef.current.style.top = `${currentTop}px`
        tileRef.current.style.left = `${currentLeft}px`
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (tileRef.current) {
      tileRef.current.style.top = `${startTop}px`
      tileRef.current.style.left = `${startLeft}px`
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [currentPosition, previousPosition])

  const containerStyle: React.CSSProperties = {
    top: positionToPixels(currentPosition[0]),
    left: positionToPixels(currentPosition[1]),
    zIndex: value,
    backgroundColor: colors[value],
  }

  const textStyle = {
    color: value && value <= 4 ? 'var(--text-color)' : 'var(--secondary-text-color)',
  }

  return (
    <div
      ref={tileRef}
      className={`${classes.container} ${isMerged ? classes.merge : ''} ${!previousPosition && !isMerged ? classes.appearing : ''}`}
      style={containerStyle}
    >
      <Text className={classes.text} style={textStyle}>
        {value}
      </Text>
    </div>
  )
}

function areSamePosition(pos1: Position, pos2?: Position) {
  if (pos2 === undefined) {
    return true
  }
  return pos1[0] === pos2[0] && pos1[1] === pos2[1]
}
