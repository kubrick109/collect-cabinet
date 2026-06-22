import { useRef, useState } from 'react'
import type { CollectionProfile } from '../types'

interface SettingsPanelProps {
  profile: CollectionProfile
  itemCount: number
  onProfileChange: (patch: Partial<CollectionProfile>) => void
  onExport: () => void
  onImport: (raw: string) => void
  onClear: () => void
}

type SettingsView = 'home' | 'profile'

export function SettingsPanel({
  profile,
  itemCount,
  onProfileChange,
  onExport,
  onImport,
  onClear,
}: SettingsPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [view, setView] = useState<SettingsView>('home')
  const [draftName, setDraftName] = useState(profile.ownerName)
  const [draftBio, setDraftBio] = useState(profile.bio)

  const saveProfile = () => {
    onProfileChange({
      ownerName: draftName.trim() || 'Collector',
      bio: draftBio.trim(),
    })
    setView('home')
  }

  if (view === 'profile') {
    return (
      <div className="animate-fade-up mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => setView('home')}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-cabinet-border bg-cabinet-surface px-4 py-2 text-sm text-cabinet-text transition hover:border-cabinet-gold-dim hover:text-cabinet-gold gold-ring"
        >
          <span aria-hidden="true">←</span>
          Back to Settings
        </button>

        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-cabinet-muted">
            This information will appear on your public collection profile.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Display Name</span>
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="field-input"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Bio</span>
              <textarea
                value={draftBio}
                onChange={(event) => setDraftBio(event.target.value)}
                rows={4}
                placeholder="Tell people about your favorite series, characters, or display style..."
                className="field-input resize-none"
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setView('home')}
              className="flex-1 rounded-xl border border-cabinet-border py-2.5 text-sm text-cabinet-muted transition hover:text-cabinet-text gold-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              className="flex-1 rounded-xl bg-cabinet-gold py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
            >
              Save Profile
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-4">
      <SettingsRow
        title="Profile"
        description={`${profile.ownerName || 'Collector'} · ${profile.bio || 'No bio yet'}`}
        action="Edit"
        onClick={() => {
          setDraftName(profile.ownerName)
          setDraftBio(profile.bio)
          setView('profile')
        }}
      />

      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold">Account & Access</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-cabinet-muted">
              This local version keeps each account separate in your browser. When published, signed-out visitors will only see the login screen.
            </p>
          </div>
          <span className="w-fit rounded-full border border-cabinet-gold/50 px-3 py-1 text-xs text-cabinet-gold">
            Signed in · {profile.ownerName || 'Collector'}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoCard title="Signed-Out View" text="Shows only the sign-in and registration screen." />
          <InfoCard title="Signed-In View" text="Opens your private rooms, collectibles, settings, and editing tools." />
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold">Collection Data</h2>
        <p className="mt-1 text-sm text-cabinet-muted">
          You currently have {itemCount} {itemCount === 1 ? 'collectible' : 'collectibles'}. Export a backup regularly while data is stored locally.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExport}
            className="rounded-xl bg-cabinet-gold px-4 py-2 text-sm font-semibold text-cabinet-bg gold-ring"
          >
            Export Data
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-cabinet-border px-4 py-2 text-sm gold-ring"
          >
            Import Data
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                try {
                  onImport(reader.result as string)
                  alert('Import successful')
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Import failed')
                }
              }
              reader.readAsText(file)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold">Collection Preferences</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoCard title="Private by Default" text="New rooms and collectibles remain private until you choose to publish them." />
          <InfoCard title="Layered Privacy" text="A collectible appears publicly only when both its room and the item itself are public." />
        </div>
      </section>

      <section className="glass-panel rounded-2xl border-cabinet-loss/30 p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-cabinet-loss">Clear Local Data</h2>
        <p className="mt-1 text-sm text-cabinet-muted">This cannot be undone. Export a backup first.</p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear the entire collection? Export a backup first—this cannot be undone.')) {
              onClear()
            }
          }}
          className="mt-4 rounded-xl border border-cabinet-loss/50 px-4 py-2 text-sm text-cabinet-loss gold-ring"
        >
          Clear All Collectibles
        </button>
      </section>

      <p className="text-center text-xs text-cabinet-muted">
        Collect Cabinet v0.1 · Local accounts · Cloud storage coming later
      </p>
    </div>
  )
}

function SettingsRow({
  title,
  description,
  action,
  onClick,
}: {
  title: string
  description: string
  action: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-panel flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left transition hover:border-cabinet-gold-dim gold-ring sm:p-6"
    >
      <span>
        <span className="block font-serif text-lg font-semibold">{title}</span>
        <span className="mt-1 line-clamp-2 block text-sm text-cabinet-muted">{description}</span>
      </span>
      <span className="shrink-0 rounded-full border border-cabinet-border px-3 py-1 text-sm text-cabinet-gold">
        {action}
      </span>
    </button>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-cabinet-border bg-cabinet-surface/55 p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-cabinet-muted">{text}</p>
    </div>
  )
}
