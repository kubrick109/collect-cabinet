import { CATEGORIES } from '../constants'
import { formatCurrency } from '../lib/stats'
import type { PortfolioStats } from '../lib/stats'

interface StatsBarProps {
  stats: PortfolioStats
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="animate-fade-up mb-8 grid gap-3 sm:grid-cols-3">
      <StatCard label="Total Items" value={String(stats.count)} sub="collectibles" />
      <StatCard label="Items Valued" value={String(stats.valuedCount)} sub="collectibles" />
      <StatCard
        label="Collection Value"
        value={stats.valuedCount ? formatCurrency(stats.totalValue) : '-'}
        sub={stats.valuedCount ? 'Based on your entered values' : 'Add item values to see a total'}
        accent={stats.valuedCount ? 'gold' : undefined}
      />

      {stats.count > 0 && (
        <div className="glass-panel col-span-full rounded-2xl p-4 sm:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cabinet-muted">
            Category Breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const block = stats.byCategory[cat.id]
              if (!block?.count) return null
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cabinet-border bg-cabinet-surface px-3 py-1 text-sm"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="text-cabinet-muted">x{block.count}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: 'gold'
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-cabinet-muted">
        {label}
      </p>
      <p className={`mt-1 font-serif text-2xl font-semibold ${accent ? 'text-cabinet-gold' : 'text-cabinet-text'}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-cabinet-muted">{sub}</p>
    </div>
  )
}
