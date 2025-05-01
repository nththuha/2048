import { colors, GAP, WIDTH } from '@/configs'
import { Position, TileProps } from '@/types'
import { Text } from '@mantine/core'
import classes from './Tile.module.scss'

export default function Tile({
  id,
  currentPosition,
  previousPosition,
  value,
  isMerged = false,
}: TileProps) {
  const positionToPixels = (position: number) => GAP / 2 + position * (WIDTH + GAP)

  const isMoved = !areSamePosition(currentPosition, previousPosition)

  const baseTop = previousPosition
    ? positionToPixels(previousPosition[0])
    : positionToPixels(currentPosition[0])
  const baseLeft = previousPosition
    ? positionToPixels(previousPosition[1])
    : positionToPixels(currentPosition[1])

  const translateY = positionToPixels(currentPosition[0]) - baseTop
  const translateX = positionToPixels(currentPosition[1]) - baseLeft

  const containerStyle: React.CSSProperties = {
    top: baseTop,
    left: baseLeft,
    zIndex: value,
    backgroundColor: colors[value],
    transform: isMoved ? `translate(${translateX}px, ${translateY}px)` : 'none',
    transition: isMoved ? 'transform 5s ease-in-out' : 'none',
  }

  console.log(id, value, previousPosition, currentPosition, isMoved, containerStyle)

  const textStyle = {
    color: value && value <= 4 ? 'var(--text-color)' : 'var(--secondary-text-color)',
  }

  return (
    <div
      className={`${classes.container} ${isMerged ? classes.merge : ''} ${
        isMoved && !isMerged ? classes.slide : ''
      }`}
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
