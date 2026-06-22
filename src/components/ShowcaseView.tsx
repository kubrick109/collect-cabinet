import { categoryEmoji } from '../constants'
import { formatCurrency } from '../lib/stats'
import type { CollectionData } from '../types'

interface ShowcaseViewProps {
  data: CollectionData
}

export function ShowcaseView({ data }: ShowcaseViewProps) {
  const { profile, items } = data
  const featured = items.filter((i) => i.imageDataUrl).slice(0, 16)

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="text-sm text-cabinet-muted">Public Collection Preview</p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          {profile.ownerName}&apos;s Collection
        </h2>
        {profile.bio && (
          <p className="mt-3 max-w-2xl text-cabinet-muted">{profile.bio}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-cabinet-border bg-cabinet-surface px-3 py-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          <span className="rounded-full border border-cabinet-border bg-cabinet-surface px-3 py-1 text-cabinet-muted">
            This is what visitors will see when your share link is published
          </span>
        </div>
      </header>

      {featured.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cabinet-border bg-cabinet-surface/50 px-6 py-14 text-center">
          <p className="font-serif text-xl font-semibold">No photos to display yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-cabinet-muted">
            Add collectibles and upload photos to build your public display wall.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {featured.map((item) => (
            <figure
              key={item.id}
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-cabinet-border bg-cabinet-elevated"
            >
              <div className="bg-[radial-gradient(circle_at_50%_24%,rgba(212,168,83,0.16),transparent_44%),linear-gradient(145deg,#211d18,#0f0d0b)] p-3">
                <img
                  src={item.imageDataUrl!}
                  alt={item.name}
                  className="w-full object-contain drop-shadow-2xl"
                />
              </div>
              <figcaption className="p-3">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-cabinet-muted">
                  {categoryEmoji(item.category)} {[item.series, item.character].filter(Boolean).join(' · ') || 'Not provided'}
                </p>
                {item.referencePrice != null && item.referencePrice > 0 && (
                  <p className="mt-2 text-xs font-medium text-cabinet-gold">
                    Value {formatCurrency(item.referencePrice)}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-cabinet-muted">
        Made with Collect Cabinet · Data currently stored in this browser
      </p>
    </div>
  )
}
