import { useState, type FormEvent } from 'react'
import { ROOM_ACCENTS, roomAccentStyle } from '../lib/accent'
import type { CollectionRoom } from '../types'

interface RoomFormProps {
  initial?: CollectionRoom
  title?: string
  submitLabel?: string
  onSubmit: (room: Omit<CollectionRoom, 'id'>) => void
  onCancel: () => void
}

export function RoomForm({
  initial,
  title = 'Create a Collection Room',
  submitLabel = 'Create Room',
  onSubmit,
  onCancel,
}: RoomFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [accent, setAccent] = useState(initial?.accent ?? 'gold')
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false)
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Please give this collection room a name')
      return
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      accent,
      isPublic,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-cabinet-muted">Organize it by character, series, category, theme, or anything you like.</p>

      {error && (
        <p className="mt-4 rounded-lg border border-cabinet-loss/40 bg-cabinet-loss/10 px-3 py-2 text-sm text-cabinet-loss">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Room Name *</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="For example: Gojo, Badge Wall, 2026 Figures"
            className="field-input"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What will this room display?"
            className="field-input resize-none"
          />
        </label>

        <div>
          <span className="mb-2 block text-xs font-medium text-cabinet-muted">Accent Color</span>
          <div className="flex flex-wrap gap-2">
            {ROOM_ACCENTS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setAccent(option.id)}
                style={roomAccentStyle(option.id)}
                className={`accent-choice rounded-full border px-4 py-2 text-sm gold-ring ${
                  accent === option.id ? 'is-selected' : ''
                }`}
              >
                <span className="accent-choice-dot" aria-hidden="true" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cabinet-border bg-cabinet-surface/60 p-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
            className="mt-1 accent-[var(--color-cabinet-gold)]"
          />
          <span>
            <span className="block text-sm font-medium">Make this room public</span>
            <span className="mt-1 block text-xs leading-relaxed text-cabinet-muted">
              Only public rooms will appear on your future shared collection page.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-cabinet-border py-2.5 text-sm text-cabinet-muted transition hover:text-cabinet-text gold-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-cabinet-gold py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
