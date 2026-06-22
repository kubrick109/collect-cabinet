import type { CSSProperties } from 'react'
import type { RoomAccent } from '../types'

export const ROOM_ACCENTS: {
  id: RoomAccent
  label: string
  color: string
  dim: string
}[] = [
  { id: 'gold', label: 'Gold', color: '#d4a853', dim: '#a67c2e' },
  { id: 'rose', label: 'Rose', color: '#df789c', dim: '#a94d70' },
  { id: 'blue', label: 'Blue', color: '#6aa7ef', dim: '#3f74b4' },
  { id: 'green', label: 'Green', color: '#6fd398', dim: '#3d9662' },
]

type AccentStyle = CSSProperties & {
  '--color-cabinet-gold': string
  '--color-cabinet-gold-dim': string
}

export function roomAccentStyle(accent: RoomAccent | string): AccentStyle {
  const selected =
    ROOM_ACCENTS.find((option) => option.id === accent) ?? ROOM_ACCENTS[0]

  return {
    '--color-cabinet-gold': selected.color,
    '--color-cabinet-gold-dim': selected.dim,
  }
}
