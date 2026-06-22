import type { CategoryId, ConditionId } from './types'

export const STORAGE_KEY = 'collect-cabinet-v1'

export const CATEGORIES: {
  id: CategoryId
  label: string
  emoji: string
}[] = [
  { id: 'badge', label: 'Pins & Badges', emoji: '◎' },
  { id: 'figure', label: 'Figures & Models', emoji: '◆' },
  { id: 'acrylic', label: 'Acrylic Stands', emoji: '◇' },
  { id: 'card', label: 'Cards & Shikishi', emoji: '▧' },
  { id: 'paper', label: 'Posters & Prints', emoji: '▤' },
  { id: 'plush', label: 'Plush & Dolls', emoji: '◌' },
  { id: 'merch', label: 'Other Merch', emoji: '✦' },
  { id: 'other', label: 'Uncategorized', emoji: '□' },
]

export const CONDITIONS: { id: ConditionId; label: string }[] = [
  { id: 'mint', label: 'New & Sealed' },
  { id: 'near_mint', label: 'Near Mint' },
  { id: 'used', label: 'Used' },
  { id: 'damaged', label: 'Damaged' },
]

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export function categoryEmoji(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? '📦'
}

export function conditionLabel(id: ConditionId): string {
  return CONDITIONS.find((c) => c.id === id)?.label ?? id
}
