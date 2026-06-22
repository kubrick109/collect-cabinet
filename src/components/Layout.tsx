import type { ReactNode } from 'react'

type Tab = 'cabinet' | 'settings'

interface LayoutProps {
  children: ReactNode
  tab: Tab
  onTabChange: (tab: Tab) => void
  onAdd: () => void
  accountName: string
  onLogout: () => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'cabinet', label: 'Collection' },
  { id: 'settings', label: 'Settings' },
]

export function Layout({
  children,
  tab,
  onTabChange,
  onAdd,
  accountName,
  onLogout,
}: LayoutProps) {
  return (
    <div className="cabinet-grid-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-cabinet-border bg-cabinet-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cabinet-elevated text-xl ring-1 ring-cabinet-border">
              ✦
            </span>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wide text-cabinet-text sm:text-xl">
                My Collect Cabinet
              </h1>
              <p className="text-xs text-cabinet-muted">Anime Collection Room</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-cabinet-border bg-cabinet-surface p-1 sm:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors gold-ring ${
                  tab === t.id
                    ? 'bg-cabinet-gold font-medium text-cabinet-bg'
                    : 'text-cabinet-muted hover:text-cabinet-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-cabinet-border bg-cabinet-surface px-3 py-1.5 text-xs text-cabinet-muted sm:inline-flex">
              Signed in · {accountName || 'Collector'}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="hidden rounded-full border border-cabinet-border px-3 py-1.5 text-xs text-cabinet-muted transition hover:text-cabinet-text gold-ring sm:inline-flex"
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full bg-cabinet-gold px-4 py-2 text-sm font-semibold text-cabinet-bg transition hover:brightness-110 gold-ring"
            >
              + Add Item
            </button>
          </div>
        </div>

        <nav className="flex border-t border-cabinet-border sm:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={`flex-1 py-2.5 text-center text-sm gold-ring ${
                tab === t.id
                  ? 'border-b-2 border-cabinet-gold font-medium text-cabinet-gold'
                  : 'text-cabinet-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  )
}
