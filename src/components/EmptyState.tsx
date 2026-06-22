interface EmptyStateProps {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-3xl border border-dashed border-cabinet-border bg-cabinet-surface/50 px-6 py-16 text-center">
      <span className="text-5xl">✦</span>
      <h2 className="mt-4 font-serif text-xl font-semibold">This room is still empty</h2>
      <p className="mt-2 max-w-sm text-sm text-cabinet-muted">
        Upload a photo of a badge, figure, acrylic stand, card, or any other collectible to get started.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 rounded-full bg-cabinet-gold px-6 py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
      >
        Add Your First Item
      </button>
    </div>
  )
}
