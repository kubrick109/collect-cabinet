import type { CategoryId, CollectItem } from '../types'

export interface PortfolioStats {
  count: number
  totalValue: number
  valuedCount: number
  seriesCount: number
  byCategory: Record<CategoryId, { count: number; cost: number }>
}

export function computeStats(items: CollectItem[]): PortfolioStats {
  const byCategory = {} as PortfolioStats['byCategory']
  let totalValue = 0
  let valuedCount = 0
  const seriesSet = new Set<string>()

  for (const item of items) {
    if (item.referencePrice != null && item.referencePrice > 0) {
      totalValue += item.referencePrice
      valuedCount += 1
    }
    if (item.series.trim()) {
      seriesSet.add(item.series.trim())
    }
    const cat = byCategory[item.category] ?? { count: 0, cost: 0 }
    cat.count += 1
    cat.cost += item.referencePrice ?? 0
    byCategory[item.category] = cat
  }

  return {
    count: items.length,
    totalValue,
    valuedCount,
    seriesCount: seriesSet.size,
    byCategory,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}
