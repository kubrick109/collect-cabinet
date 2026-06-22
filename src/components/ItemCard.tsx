import { categoryEmoji, categoryLabel } from '../constants'
import { formatCurrency } from '../lib/stats'
import type { CollectItem } from '../types'

interface ItemCardProps {
  item: CollectItem
  view: 'grid' | 'list'
  onClick: () => void
}

export function ItemCard({ item, view, onClick }: ItemCardProps) {
  const value = item.referencePrice

  if (view === 'list') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="glass-panel group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:border-cabinet-gold-dim gold-ring sm:p-4"
      >
        <Thumb image={item.imageDataUrl} name={item.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{item.name}</p>
          <p className="truncate text-sm text-cabinet-muted">
            {categoryEmoji(item.category)} {item.character || item.series || categoryLabel(item.category)}
          </p>
        </div>
        {value != null && value > 0 && (
          <div className="shrink-0 text-right text-sm">
            <p className="text-xs text-cabinet-muted">Value</p>
            <p className="font-medium text-cabinet-gold">{formatCurrency(value)}</p>
          </div>
        )}
      </button>
    )
  }

  return (
      <button
        type="button"
        onClick={onClick}
        className="cabinet-case group text-left gold-ring"
      >
      <div className="cabinet-stage">
        <div className="cabinet-spotlight" />
        <div className="cabinet-glass-sheen" />
        {item.imageDataUrl ? (
          <img
            src={item.imageDataUrl}
            alt={item.name}
            className="cabinet-object"
          />
        ) : (
          <div className="relative z-10 flex h-full items-center justify-center text-5xl opacity-40">
            {categoryEmoji(item.category)}
          </div>
        )}
        {item.virtualFigureStatus === 'ready' && (
          <span className="virtual-ready-badge">Virtual Figure</span>
        )}
        <div className="cabinet-shelf" />
      </div>
      <div className="cabinet-label">
        <p className="truncate font-medium">{item.name}</p>
        <p className="mt-0.5 truncate text-xs text-cabinet-muted">
          {item.character || item.series || categoryLabel(item.category)}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-cabinet-muted">
            {categoryEmoji(item.category)} {categoryLabel(item.category)}
          </span>
          {value != null && value > 0 && (
            <span className="text-sm font-semibold text-cabinet-gold">
              {formatCurrency(value)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function Thumb({ image, name }: { image: string | null; name: string }) {
  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cabinet-surface">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-contain p-1" />
      ) : (
        <div className="flex h-full items-center justify-center text-2xl opacity-50">□</div>
      )}
    </div>
  )
}
