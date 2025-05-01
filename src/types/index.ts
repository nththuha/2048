export type Position = [number, number]
export type Direction = 'up' | 'down' | 'left' | 'right'

export type TileProps = {
  id: string
  currentPosition: Position
  previousPosition?: Position
  value: number
  isMerged?: boolean
  isRemoved?: boolean
}

export type NullString = string | null
export type NullNumber = number | null
export type BoardProps = NullString[][]
