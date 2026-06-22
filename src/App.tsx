import { useMemo, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { EmptyState } from './components/EmptyState'
import { ItemCard } from './components/ItemCard'
import { ItemDetail } from './components/ItemDetail'
import { ItemForm, type ItemFormValues } from './components/ItemForm'
import { Layout } from './components/Layout'
import { Modal } from './components/Modal'
import { RoomForm } from './components/RoomForm'
import { RoomLobby } from './components/RoomLobby'
import { SettingsPanel } from './components/SettingsPanel'
import { StatsBar } from './components/StatsBar'
import { CATEGORIES } from './constants'
import { useCollection } from './hooks/useCollection'
import { roomAccentStyle } from './lib/accent'
import { createDemoCollection } from './lib/demo'
import { computeStats } from './lib/stats'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type AuthUser,
} from './lib/auth'
import {
  createVirtualFigureJob,
  waitForVirtualFigure,
} from './lib/virtualFigureProvider'
import type { CategoryId, SortKey, ViewMode } from './types'

type Tab = 'cabinet' | 'settings'
type ModalMode = 'add' | 'edit' | 'detail' | 'room' | 'roomSettings' | null

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser())
  const {
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
  } = useCollection(user?.id)

  const [tab, setTab] = useState<Tab>('cabinet')
  const [modal, setModal] = useState<ModalMode>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

  const activeItem = data.items.find((i) => i.id === activeId)
  const activeRoom = data.rooms.find((room) => room.id === activeRoomId)
  const roomItems = activeRoomId
    ? data.items.filter((item) => item.roomId === activeRoomId)
    : data.items

  const filtered = useMemo(() => {
    let list = [...roomItems]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.series.toLowerCase().includes(q) ||
          i.character.toLowerCase().includes(q) ||
          i.notes.toLowerCase().includes(q),
      )
    }
    if (categoryFilter !== 'all') {
      list = list.filter((i) => i.category === categoryFilter)
    }
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.createdAt.localeCompare(b.createdAt)
        case 'value_desc':
          return (b.referencePrice ?? 0) - (a.referencePrice ?? 0)
        default:
          return b.createdAt.localeCompare(a.createdAt)
      }
    })
    return list
  }, [roomItems, search, categoryFilter, sort])

  const stats = useMemo(() => computeStats(roomItems), [roomItems])

  const openAdd = () => {
    if (!activeRoomId) {
      setModal('room')
      return
    }
    setActiveId(null)
    setModal('add')
  }

  const openDetail = (id: string) => {
    setActiveId(id)
    setModal('detail')
  }

  const generateVirtualFigure = async (id: string) => {
    const item = data.items.find((candidate) => candidate.id === id)
    if (!item?.imageDataUrl) return

    updateItem(id, {
      virtualFigureStatus: 'queued',
      virtualFigureModelUrl: null,
      virtualFigureProvider: null,
      virtualFigureJobId: null,
    })

    try {
      const job = await createVirtualFigureJob({
        itemId: item.id,
        name: item.name,
        imageDataUrl: item.imageDataUrl,
      })
      updateItem(id, {
        virtualFigureStatus: 'generating',
        virtualFigureProvider: job.provider,
        virtualFigureJobId: job.jobId,
      })

      const result = await waitForVirtualFigure(job)
      updateItem(id, {
        virtualFigureStatus: 'ready',
        virtualFigureModelUrl: result.modelUrl,
        virtualFigureProvider: result.provider,
        virtualFigureJobId: result.jobId,
      })
    } catch {
      updateItem(id, {
        virtualFigureStatus: 'failed',
      })
    }
  }

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `collect-cabinet-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    replaceAll({
      version: 1,
      profile: data.profile,
      rooms: data.rooms,
      items: [],
    })
  }

  const handleLogin = (username: string, password: string) => {
    setUser(loginUser(username, password))
  }

  const handleRegister = (username: string, password: string) => {
    setUser(registerUser(username, password))
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setActiveRoomId(null)
    setActiveId(null)
    setModal(null)
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
  }

  return (
    <>
      <Layout
        tab={tab}
        onTabChange={setTab}
        onAdd={openAdd}
        accountName={data.profile.ownerName}
        onLogout={handleLogout}
      >
        {tab === 'cabinet' && (
          <>
            {!activeRoomId ? (
              <RoomLobby
                rooms={data.rooms}
                items={data.items}
                onEnter={setActiveRoomId}
                onCreate={() => setModal('room')}
              />
            ) : (
              <div
                className="room-theme -mx-4 px-4 sm:-mx-6 sm:px-6"
                style={roomAccentStyle(activeRoom?.accent ?? 'gold')}
              >
                <div className="sticky top-[73px] z-30 -mx-1 mb-4 flex justify-start bg-cabinet-bg/80 px-1 py-2 backdrop-blur-md sm:top-[65px]">
                  <button
                    type="button"
                    onClick={() => setActiveRoomId(null)}
                    className="inline-flex items-center gap-2 rounded-full border border-cabinet-border bg-cabinet-surface px-4 py-2 text-sm font-medium text-cabinet-text shadow-lg shadow-black/20 transition hover:border-cabinet-gold-dim hover:text-cabinet-gold gold-ring"
                  >
                    <span aria-hidden="true">←</span>
                    Exit Room
                  </button>
                </div>

                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-semibold">{activeRoom?.name}</h2>
                    {activeRoom?.description && (
                      <p className="mt-2 max-w-2xl text-sm text-cabinet-muted">
                        {activeRoom.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setModal('roomSettings')}
                      className="rounded-full border border-cabinet-border bg-cabinet-surface px-5 py-2.5 text-sm font-medium text-cabinet-text transition hover:border-cabinet-gold-dim hover:text-cabinet-gold gold-ring"
                    >
                      Room Settings
                    </button>
                    <button
                      type="button"
                      onClick={openAdd}
                      className="rounded-full bg-cabinet-gold px-5 py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <StatsBar stats={stats} />

            {roomItems.length > 0 && (
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search names, series, characters, or notes..."
                  className="field-input max-w-md"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value as CategoryId | 'all')
                    }
                    className="field-input w-auto min-w-[120px]"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="field-input w-auto min-w-[120px]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="value_desc">Highest Value</option>
                  </select>
                  <div className="flex rounded-xl border border-cabinet-border p-0.5">
                    {(['grid', 'list'] as ViewMode[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setViewMode(v)}
                        className={`rounded-lg px-3 py-1.5 text-xs gold-ring ${
                          viewMode === v
                            ? 'bg-cabinet-gold text-cabinet-bg'
                            : 'text-cabinet-muted'
                        }`}
                      >
                        {v === 'grid' ? 'Display' : 'List'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {roomItems.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-cabinet-muted">No matching collectibles</p>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'
                    : 'flex flex-col gap-2'
                }
              >
                {filtered.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    view={viewMode}
                    onClick={() => openDetail(item.id)}
                  />
                ))}
              </div>
            )}
              </div>
            )}
          </>
        )}

        {tab === 'settings' && (
          <SettingsPanel
            profile={data.profile}
            itemCount={data.items.length}
            onProfileChange={updateProfile}
            onExport={handleExport}
            onImport={importJson}
            onClear={handleClear}
          />
        )}

        {tab === 'settings' && data.items.length === 0 && (
          <div className="mx-auto mt-4 max-w-xl text-center">
            <button
              type="button"
              onClick={() => replaceAll(createDemoCollection())}
              className="text-sm text-cabinet-gold underline-offset-2 hover:underline gold-ring"
            >
              Load Demo Collection
            </button>
          </div>
        )}
      </Layout>

      <Modal open={modal === 'add'} onClose={() => setModal(null)} wide>
        <ItemForm
          title="Add to Collection"
          submitLabel="Add to Display"
          onCancel={() => setModal(null)}
          onSubmit={(values: ItemFormValues) => {
            if (activeRoomId) {
              addItem({ ...values, roomId: activeRoomId })
            }
            setModal(null)
          }}
        />
      </Modal>

      <Modal open={modal === 'room'} onClose={() => setModal(null)} wide>
        <RoomForm
          onCancel={() => setModal(null)}
          onSubmit={(room) => {
            const id = addRoom(room)
            setActiveRoomId(id)
            setModal(null)
          }}
        />
      </Modal>

      <Modal open={modal === 'roomSettings' && !!activeRoom} onClose={() => setModal(null)} wide>
        {activeRoom && (
          <RoomForm
            title="Room Settings"
            submitLabel="Save Settings"
            initial={activeRoom}
            onCancel={() => setModal(null)}
            onSubmit={(room) => {
              updateRoom(activeRoom.id, room)
              setModal(null)
            }}
          />
        )}
      </Modal>

      <Modal open={modal === 'edit' && !!activeItem} onClose={() => setModal('detail')} wide>
        {activeItem && (
          <ItemForm
            title="Edit Collectible"
            submitLabel="Update Item"
            initial={activeItem}
            onCancel={() => setModal('detail')}
            onSubmit={(values) => {
              updateItem(activeItem.id, values)
              setModal('detail')
            }}
          />
        )}
      </Modal>

      <Modal open={modal === 'detail' && !!activeItem} onClose={() => setModal(null)} wide>
        {activeItem && (
          <ItemDetail
            item={activeItem}
            onClose={() => setModal(null)}
            onEdit={() => setModal('edit')}
            onGenerateVirtualFigure={() => void generateVirtualFigure(activeItem.id)}
            onDelete={() => {
              removeItem(activeItem.id)
              setModal(null)
              setActiveId(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}

export default App
