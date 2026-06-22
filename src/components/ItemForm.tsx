import { useState, type FormEvent, type ReactNode } from 'react'
import { CATEGORIES } from '../constants'
import { identifyCollectible } from '../lib/identify'
import { compressImageFile } from '../lib/image'
import type { CategoryId, CollectItem } from '../types'

export type ItemFormValues = Omit<CollectItem, 'id' | 'roomId' | 'createdAt' | 'updatedAt'>

const emptyForm = (): ItemFormValues => ({
  name: '',
  isPublic: false,
  category: 'badge',
  series: '',
  character: '',
  rarity: 'common',
  purchasePrice: 0,
  referencePrice: null,
  purchaseDate: new Date().toISOString().slice(0, 10),
  condition: 'near_mint',
  notes: '',
  imageDataUrl: null,
  virtualFigureStatus: 'none',
  virtualFigureModelUrl: null,
  virtualFigureProvider: null,
  virtualFigureJobId: null,
})

interface ItemFormProps {
  initial?: ItemFormValues
  title: string
  submitLabel: string
  onSubmit: (values: ItemFormValues) => void
  onCancel: () => void
}

export function ItemForm({
  initial,
  title,
  submitLabel,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const [form, setForm] = useState<ItemFormValues>({
    ...emptyForm(),
    ...initial,
  })
  const [imageBusy, setImageBusy] = useState(false)
  const [scanState, setScanState] = useState(
    initial?.imageDataUrl ? 'Display preview ready' : 'Waiting for a photo',
  )
  const [error, setError] = useState('')

  const patch = <K extends keyof ItemFormValues>(key: K, value: ItemFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImage = async (file: File | undefined) => {
    if (!file) return
    setImageBusy(true)
    setError('')
    setScanState('Preparing photo...')
    try {
      const dataUrl = await compressImageFile(file)
      setScanState('Searching for related information...')
      const result = await identifyCollectible(file, dataUrl)
      setForm((prev) => ({
        ...prev,
        imageDataUrl: dataUrl,
        name: prev.name || result.name || '',
        series: prev.series || result.series || '',
        character: prev.character || result.character || '',
        category: result.category || prev.category,
      }))
      setScanState(
        result.series || result.character
          ? 'Recognition results added automatically—you can still edit them'
          : 'Name draft created; character and series details will be added when online recognition is connected',
      )
    } catch {
      setError('Could not process that image. Please try another one.')
      setScanState('Waiting for a photo')
    } finally {
      setImageBusy(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.imageDataUrl) {
      setError('Please upload a photo of the collectible first')
      return
    }
    if (!form.name.trim()) {
      setError('Please enter a name for the collectible')
      return
    }
    if ((form.referencePrice ?? 0) < 0) {
      setError('Value cannot be negative')
      return
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      series: form.series.trim(),
      character: form.character.trim(),
      notes: form.notes.trim(),
      purchasePrice: 0,
      purchaseDate: new Date().toISOString().slice(0, 10),
      condition: 'near_mint',
      rarity: form.rarity || 'common',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[85vh] flex-col">
      <div className="border-b border-cabinet-border px-5 py-4 sm:px-6">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-cabinet-muted">Upload a photo and turn it into a display-ready collection card.</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 sm:px-6">
        {error && (
          <p className="rounded-lg border border-cabinet-loss/40 bg-cabinet-loss/10 px-3 py-2 text-sm text-cabinet-loss">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
          <label className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-cabinet-border bg-[radial-gradient(circle_at_50%_28%,rgba(212,168,83,0.18),transparent_42%),linear-gradient(145deg,#211d18,#0f0d0b)]">
            {form.imageDataUrl ? (
              <img
                src={form.imageDataUrl}
                alt="Preview"
                className="h-full w-full object-contain p-3 drop-shadow-2xl transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="px-4 text-center text-sm text-cabinet-muted">
                {imageBusy ? 'Processing photo...' : 'Upload Collectible Photo'}
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              disabled={imageBusy}
              onChange={(e) => void handleImage(e.target.files?.[0])}
            />
          </label>

          <div className="space-y-3">
            <div className="rounded-xl border border-cabinet-border bg-cabinet-surface/70 p-3">
              <p className="text-xs font-medium text-cabinet-muted">Smart Details</p>
              <p className="mt-1 text-sm">{scanState}</p>
              <p className="mt-2 text-xs leading-relaxed text-cabinet-muted">
                Rarity will be evaluated by the system, so you do not need to select it manually.
              </p>
            </div>

            <Field label="Collectible Name *">
              <input
                value={form.name}
                onChange={(e) => patch('name', e.target.value)}
                placeholder="For example: Gojo 2024 Mirror Badge"
                className="field-input"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Series / IP">
                <input
                  value={form.series}
                  onChange={(e) => patch('series', e.target.value)}
                  placeholder="Jujutsu Kaisen, Hatsune Miku..."
                  className="field-input"
                />
              </Field>
              <Field label="Character">
                <input
                  value={form.character}
                  onChange={(e) => patch('character', e.target.value)}
                  placeholder="Character name"
                  className="field-input"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-1">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => patch('category', e.target.value as CategoryId)}
              className="field-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Value ($)">
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.referencePrice ?? ''}
            onChange={(e) => patch('referencePrice', Number(e.target.value) || null)}
            placeholder="Enter your own estimate; market pricing can be added later"
            className="field-input"
          />
        </Field>

        <Field label="Description / Notes">
          <textarea
            value={form.notes}
            onChange={(e) => patch('notes', e.target.value)}
            rows={4}
            placeholder="Why you like it, how you found it, display ideas, matching items..."
            className="field-input resize-none"
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cabinet-border bg-cabinet-surface/60 p-3">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => patch('isPublic', e.target.checked)}
            className="mt-1 accent-[var(--color-cabinet-gold)]"
          />
          <span>
            <span className="block text-sm font-medium">Make this collectible public</span>
            <span className="mt-1 block text-xs leading-relaxed text-cabinet-muted">
              Only public collectibles will appear on your future shared collection page.
            </span>
          </span>
        </label>
      </div>

      <div className="flex gap-3 border-t border-cabinet-border px-5 py-4 sm:px-6">
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">{label}</span>
      {children}
    </label>
  )
}
