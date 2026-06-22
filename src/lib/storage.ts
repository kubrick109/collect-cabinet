import { STORAGE_KEY } from '../constants'
import type { CategoryId, CollectItem, CollectionData, RoomAccent } from '../types'

const DEFAULT_DATA: CollectionData = {
  version: 1,
  profile: {
    ownerName: 'Collector',
    bio: 'My private collection',
  },
  rooms: [],
  items: [],
}

export function loadCollection(userId?: string): CollectionData {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return structuredClone(DEFAULT_DATA)
    const parsed = JSON.parse(raw) as CollectionData
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) {
      return structuredClone(DEFAULT_DATA)
    }
    return normalizeCollection(parsed)
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

export function saveCollection(data: CollectionData, userId?: string): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(data))
}

export function exportCollectionJson(data: CollectionData): string {
  return JSON.stringify(data, null, 2)
}

export function importCollectionJson(raw: string): CollectionData {
  const parsed = JSON.parse(raw) as CollectionData
  if (parsed.version !== 1 || !Array.isArray(parsed.items)) {
    throw new Error('Invalid Collect Cabinet backup file')
  }
  return normalizeCollection(parsed)
}

function normalizeCollection(data: CollectionData): CollectionData {
  return {
    version: 1,
    profile: {
      ownerName:
        data.profile?.ownerName === '\u6536\u85cf\u5bb6'
          ? DEFAULT_DATA.profile.ownerName
          : data.profile?.ownerName || DEFAULT_DATA.profile.ownerName,
      bio:
        data.profile?.bio === '\u6211\u7684\u79c1\u4eba\u6536\u85cf\u9986'
          ? DEFAULT_DATA.profile.bio
          : data.profile?.bio || DEFAULT_DATA.profile.bio,
    },
    rooms: normalizeRooms(data.rooms, data.items.length),
    items: data.items.map(normalizeItem),
  }
}

function normalizeItem(item: CollectItem): CollectItem {
  return {
    ...item,
    roomId: item.roomId || inferRoomId(item.category),
    isPublic: item.isPublic ?? false,
    category: normalizeCategory(item.category),
    character: item.character ?? '',
    rarity: item.rarity ?? 'common',
    purchasePrice: item.purchasePrice ?? 0,
    referencePrice: item.referencePrice ?? null,
    purchaseDate: item.purchaseDate || new Date().toISOString().slice(0, 10),
    condition: item.condition ?? 'near_mint',
    notes: item.notes ?? '',
    imageDataUrl: item.imageDataUrl ?? null,
    virtualFigureStatus: item.virtualFigureStatus ?? 'none',
    virtualFigureModelUrl: item.virtualFigureModelUrl ?? null,
    virtualFigureProvider: item.virtualFigureProvider ?? null,
    virtualFigureJobId: item.virtualFigureJobId ?? null,
  }
}

function normalizeRooms(
  rooms: CollectionData['rooms'] | undefined,
  itemCount: number,
): CollectionData['rooms'] {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    if (itemCount === 0) return []
    return [
      {
        id: 'uncategorized-room',
        name: 'Uncategorized Collectibles',
        description: 'Older collectibles are placed here until you organize them into a new room.',
        accent: 'gold',
        isPublic: false,
      },
    ]
  }
  return rooms.map((room, index) => ({
    id: room.id || `room-${index + 1}`,
    name:
      room.id === 'uncategorized-room' ||
      room.name === '\u672a\u5206\u7c7b\u6536\u85cf\u9986'
        ? 'Uncategorized Collectibles'
        : room.name || `Collection Room ${index + 1}`,
    description:
      room.id === 'uncategorized-room' ||
      room.name === '\u672a\u5206\u7c7b\u6536\u85cf\u9986'
        ? 'Older collectibles are placed here until you organize them into a new room.'
        : room.description || 'This room does not have a description yet.',
    accent: normalizeAccent(room.accent),
    isPublic: room.isPublic ?? false,
  }))
}

function inferRoomId(category: string): string {
  if (category) return 'uncategorized-room'
  return 'uncategorized-room'
}

function normalizeCategory(category: string): CategoryId {
  if (category === 'toy') return 'plush'
  if (category === 'sneaker') return 'other'
  if (
    category === 'badge' ||
    category === 'acrylic' ||
    category === 'card' ||
    category === 'figure' ||
    category === 'paper' ||
    category === 'plush' ||
    category === 'merch' ||
    category === 'other'
  ) {
    return category
  }
  return 'other'
}

function normalizeAccent(accent: string): RoomAccent {
  if (accent === 'rose' || accent === 'blue' || accent === 'green') {
    return accent
  }
  return 'gold'
}

function storageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY
}
