import { useCallback, useEffect, useState } from 'react'
import type { CollectItem, CollectionData, CollectionProfile, CollectionRoom } from '../types'
import { createId } from '../lib/id'
import {
  exportCollectionJson,
  importCollectionJson,
  loadCollection,
  saveCollection,
} from '../lib/storage'

export function useCollection(userId?: string) {
  const [data, setData] = useState<CollectionData>(() => loadCollection(userId))
  const [loadedUserId, setLoadedUserId] = useState(userId)

  useEffect(() => {
    if (loadedUserId === userId) return
    const timeout = window.setTimeout(() => {
      setData(loadCollection(userId))
      setLoadedUserId(userId)
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [loadedUserId, userId])

  useEffect(() => {
    if (loadedUserId !== userId) return
    saveCollection(data, userId)
  }, [data, loadedUserId, userId])

  const updateProfile = useCallback((profile: Partial<CollectionProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }))
  }, [])

  const addItem = useCallback((item: Omit<CollectItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newItem: CollectItem = {
      ...item,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    }
    setData((prev) => ({ ...prev, items: [newItem, ...prev.items] }))
    return newItem.id
  }, [])

  const addRoom = useCallback((room: Omit<CollectionRoom, 'id'>) => {
    const newRoom: CollectionRoom = {
      ...room,
      id: createId(),
    }
    setData((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }))
    return newRoom.id
  }, [])

  const updateRoom = useCallback((id: string, patch: Partial<CollectionRoom>) => {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.id === id ? { ...room, ...patch, id: room.id } : room,
      ),
    }))
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<CollectItem>) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, ...patch, updatedAt: new Date().toISOString() }
          : item,
      ),
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }, [])

  const replaceAll = useCallback((next: CollectionData) => {
    setData(next)
  }, [])

  const exportJson = useCallback(() => exportCollectionJson(data), [data])

  const importJson = useCallback((raw: string) => {
    const next = importCollectionJson(raw)
    setData(next)
  }, [])

  return {
    data,
    updateProfile,
    addItem,
    addRoom,
    updateRoom,
    updateItem,
    removeItem,
    replaceAll,
    exportJson,
    importJson,
  }
}
