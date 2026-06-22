export type CategoryId =
  | 'badge'
  | 'acrylic'
  | 'card'
  | 'figure'
  | 'paper'
  | 'plush'
  | 'merch'
  | 'other'

export type ConditionId = 'mint' | 'near_mint' | 'used' | 'damaged'

export type RarityId = 'common' | 'limited' | 'rare' | 'grail'

export type VirtualFigureStatus = 'none' | 'queued' | 'generating' | 'ready' | 'failed'
export type RoomAccent = 'gold' | 'rose' | 'blue' | 'green'

export interface CollectItem {
  id: string
  roomId: string
  isPublic: boolean
  name: string
  category: CategoryId
  series: string
  character: string
  rarity: RarityId
  purchasePrice: number
  referencePrice: number | null
  purchaseDate: string
  condition: ConditionId
  notes: string
  imageDataUrl: string | null
  virtualFigureStatus: VirtualFigureStatus
  virtualFigureModelUrl: string | null
  virtualFigureProvider: string | null
  virtualFigureJobId: string | null
  createdAt: string
  updatedAt: string
}

export interface CollectionProfile {
  ownerName: string
  bio: string
}

export interface CollectionRoom {
  id: string
  name: string
  description: string
  accent: RoomAccent
  isPublic: boolean
}

export interface CollectionData {
  version: 1
  profile: CollectionProfile
  rooms: CollectionRoom[]
  items: CollectItem[]
}

export type SortKey = 'newest' | 'oldest' | 'value_desc'

export type ViewMode = 'grid' | 'list'
