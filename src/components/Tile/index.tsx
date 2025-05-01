import { colors, GAP, WIDTH } from '@/configs'
import { TileProps } from '@/types'
import { Text } from '@mantine/core'
import classes from './Tile.module.scss'

export default function Tile({ id, position, value, isMerged = false }: TileProps) {
  // const previousId = usePreviousProps(id, position)
  // const hasChanged = previousId !== undefined && previousId !== id

  // console.log('xxx', id, previousId, hasChanged, position)

  const positionToPixels = (position: number) => GAP / 2 + position * (WIDTH + GAP)

  const containerStyle = {
    top: positionToPixels(position[0]),
    left: positionToPixels(position[1]),
    zIndex: value,
    backgroundColor: colors[value],
  }

  const textStyle = {
    color: value && value <= 4 ? 'var(--text-color)' : 'var(--secondary-text-color)',
  }

  return (
    <div
      className={`${classes.container} ${isMerged ? classes.merge : ''}`}
      style={containerStyle}
      data-id={id}
    >
      <Text className={classes.text} style={textStyle}>
        {value}
      </Text>
    </div>
  )
}
