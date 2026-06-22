import type { CollectionRoom, CollectItem } from '../types'
import { roomAccentStyle } from '../lib/accent'

interface RoomLobbyProps {
  rooms: CollectionRoom[]
  items: CollectItem[]
  onEnter: (roomId: string) => void
  onCreate: () => void
}

export function RoomLobby({ rooms, items, onEnter, onCreate }: RoomLobbyProps) {
  return (
    <section className="room-entry min-h-[calc(100vh-112px)] overflow-hidden rounded-[2rem] border border-cabinet-border bg-cabinet-bg/60 px-4 py-8 sm:px-8">
      <div className="door-scene mx-auto max-w-3xl text-center">
        <div className="door-frame mx-auto mb-8" aria-hidden="true">
          <div className="door-panel door-left" />
          <div className="door-panel door-right" />
          <div className="door-glow" />
        </div>
        <h2 className="font-serif text-3xl font-bold sm:text-5xl">Choose a Collection Room</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cabinet-muted">
          Create rooms for a character, series, type of collectible, or a whole display you want to share with friends.
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-cabinet-border bg-cabinet-surface/60 px-6 py-10 text-center">
          <p className="font-serif text-xl font-semibold">No collection rooms yet</p>
          <p className="mt-2 text-sm text-cabinet-muted">
            Create your first room, then start adding collectibles.
          </p>
          <button
            type="button"
            onClick={onCreate}
            className="mt-6 rounded-full bg-cabinet-gold px-6 py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
          >
            Create a Room
          </button>
        </div>
      ) : (
        <div className="room-grid mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => {
            const count = items.filter((item) => item.roomId === room.id).length
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onEnter(room.id)}
                className="room-card themed-room-card glass-panel rounded-2xl p-5 text-left gold-ring"
                style={{
                  ...roomAccentStyle(room.accent),
                  animationDelay: `${index * 90}ms`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-cabinet-muted">Collection Room</p>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${
                    room.isPublic
                      ? 'border-cabinet-gold/50 text-cabinet-gold'
                      : 'border-cabinet-border text-cabinet-muted'
                  }`}>
                    {room.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold">{room.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-cabinet-muted">
                  {room.description || 'This room does not have a description yet.'}
                </p>
                <p className="mt-6 text-sm text-cabinet-gold">{count} {count === 1 ? 'item' : 'items'}</p>
              </button>
            )
          })}

          <button
            type="button"
            onClick={onCreate}
            className="room-card rounded-2xl border border-dashed border-cabinet-border bg-cabinet-surface/40 p-5 text-left text-cabinet-muted transition hover:border-cabinet-gold-dim hover:text-cabinet-text gold-ring"
          >
            <p className="text-3xl">+</p>
            <h3 className="mt-3 font-serif text-xl font-semibold">New Collection Room</h3>
            <p className="mt-2 text-sm">Create a custom display space.</p>
          </button>
        </div>
      )}
    </section>
  )
}
