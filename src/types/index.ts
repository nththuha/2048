export type Position = [number, number]
export type Direction = 'up' | 'down' | 'left' | 'right'

export type TileProps = {
  id: string
  position: Position
  value: number
  isMerged?: boolean
}

export type NullString = string | null
export type NullNumber = number | null
export type BoardProps = NullString[][]
