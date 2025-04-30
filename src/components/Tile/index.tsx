import { colors, GAP, MERGE_ANIMATION_DURATION, WIDTH } from '@/configs'
import usePreviousProps from '@/hooks/usePreviousProps'
import { TileProps } from '@/types'
import { Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import classes from './Tile.module.scss'

export default function Tile({ position, value }: TileProps) {
  const [scale, setScale] = useState(1)
  const previousValue = usePreviousProps(value)
  const hasChanged = previousValue !== value

  const positionToPixels = (position: number) => GAP / 2 + position * (WIDTH + GAP)

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1)
      setTimeout(() => setScale(1), MERGE_ANIMATION_DURATION)
    }
  }, [hasChanged])

  const containerStyle = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
    transform: `scale(${scale})`,
    zIndex: value,
    backgroundColor: colors[value],
  }

  const textStyle = {
    color: value && value <= 4 ? 'var(--text-color)' : 'var(--secondary-text-color)',
  }

  return (
    <div className={classes.container} style={containerStyle}>
      <Text className={classes.text} style={textStyle}>
        {value}
      </Text>
    </div>
  )
}
