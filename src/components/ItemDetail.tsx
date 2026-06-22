import { categoryEmoji, categoryLabel } from '../constants'
import { formatCurrency } from '../lib/stats'
import type { CollectItem } from '../types'
import { VirtualFigure } from './VirtualFigure'

interface ItemDetailProps {
  item: CollectItem
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onGenerateVirtualFigure: () => void
}

export function ItemDetail({
  item,
  onClose,
  onEdit,
  onDelete,
  onGenerateVirtualFigure,
}: ItemDetailProps) {
  return (
    <div className="no-scrollbar flex max-h-[90vh] flex-col">
      <div className="detail-showcase relative aspect-[4/3] overflow-hidden sm:aspect-video">
        <div className="cabinet-spotlight detail-light" />
        <div className="cabinet-glass-sheen" />
        {item.imageDataUrl ? (
          <img
            src={item.imageDataUrl}
            alt={item.name}
            className="detail-object"
          />
        ) : (
          <div className="relative z-10 flex h-full items-center justify-center text-7xl opacity-30">
            {categoryEmoji(item.category)}
          </div>
        )}
        <div className="detail-plinth" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-sm backdrop-blur transition hover:bg-black/75 gold-ring"
        >
          Close
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4 sm:px-6">
        <p className="text-xs text-cabinet-muted">
          {categoryEmoji(item.category)} {categoryLabel(item.category)}
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold">{item.name}</h2>
        {(item.series || item.character) && (
          <p className="mt-1 text-cabinet-muted">
            {[item.series, item.character].filter(Boolean).join(' · ')}
          </p>
        )}

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <Detail label="Series / IP" value={item.series || 'Not provided'} />
          <Detail label="Character" value={item.character || 'Not provided'} />
          <Detail
            label="Value"
            value={
              item.referencePrice != null && item.referencePrice > 0
                ? formatCurrency(item.referencePrice)
                : 'Not provided'
            }
            highlight
          />
          <Detail label="System Rarity" value="Pending review" />
        </dl>

        {item.notes && (
          <div className="mt-5 rounded-xl border border-cabinet-border bg-cabinet-surface/50 p-4">
            <p className="text-xs font-medium text-cabinet-muted">Description / Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{item.notes}</p>
          </div>
        )}

        <VirtualFigure
          image={item.imageDataUrl}
          name={item.name}
          status={item.virtualFigureStatus}
          modelUrl={item.virtualFigureModelUrl}
          onGenerate={onGenerateVirtualFigure}
        />
      </div>

      <div className="flex gap-3 border-t border-cabinet-border px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete "${item.name}"?`)) onDelete()
          }}
          className="rounded-xl border border-cabinet-loss/40 px-4 py-2.5 text-sm text-cabinet-loss gold-ring"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-xl bg-cabinet-gold py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl border border-cabinet-border bg-cabinet-surface/40 px-4 py-3">
      <dt className="text-xs text-cabinet-muted">{label}</dt>
      <dd className={`mt-1 font-medium ${highlight ? 'text-cabinet-gold' : 'text-cabinet-text'}`}>
        {value}
      </dd>
    </div>
  )
}
