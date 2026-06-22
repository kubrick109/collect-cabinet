import { useState } from 'react'

interface VirtualFigureProps {
  image: string | null
  name: string
  status: 'none' | 'queued' | 'generating' | 'ready' | 'failed'
  modelUrl: string | null
  onGenerate: () => void
}

export function VirtualFigure({ image, name, status, modelUrl, onGenerate }: VirtualFigureProps) {
  const [angle, setAngle] = useState(18)
  const ready = status === 'ready'
  const hasModel = ready && !!modelUrl

  return (
    <section className="mt-5 rounded-2xl border border-cabinet-border bg-cabinet-surface/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold">Virtual Figure</h3>
          <p className="mt-1 text-sm text-cabinet-muted">
            Create a display-case version based on the original photo.
          </p>
        </div>
        {status === 'none' && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={!image}
            className="rounded-full bg-cabinet-gold px-4 py-2 text-sm font-semibold text-cabinet-bg disabled:cursor-not-allowed disabled:opacity-45 gold-ring"
          >
            Generate Virtual Figure
          </button>
        )}
        {status === 'queued' && (
          <span className="rounded-full border border-cabinet-gold/40 px-4 py-2 text-sm text-cabinet-gold">
            Queued...
          </span>
        )}
        {status === 'generating' && (
          <span className="rounded-full border border-cabinet-gold/40 px-4 py-2 text-sm text-cabinet-gold">
            Generating...
          </span>
        )}
        {status === 'ready' && (
          <span className="rounded-full border border-cabinet-gold/40 px-4 py-2 text-sm text-cabinet-gold">
            Added to Display
          </span>
        )}
      </div>

      {status === 'failed' && (
        <p className="mt-3 rounded-xl border border-cabinet-loss/40 bg-cabinet-loss/10 px-3 py-2 text-sm text-cabinet-loss">
          Generation failed. You can try again later.
        </p>
      )}

      <div className={`virtual-figure-case mt-4 ${ready ? 'is-ready' : ''}`}>
        {(status === 'queued' || status === 'generating') && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center text-sm text-cabinet-muted">
            <span className="virtual-job-spinner" />
            <span>{status === 'queued' ? 'Your figure is in the generation queue.' : 'Creating a display-case figure from the original photo.'}</span>
          </div>
        )}

        {ready && image ? (
          <>
            <div className="virtual-figure-light" />
            <div className="virtual-figure-stage">
              <div
                className="virtual-figure-object"
                style={{ transform: `rotateY(${angle}deg)` }}
              >
                <img src={image} alt={`${name} virtual figure`} />
                <span className="virtual-figure-edge" />
              </div>
              <div className="virtual-figure-base" />
            </div>
          </>
        ) : status === 'none' || status === 'failed' ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-cabinet-muted">
            {image ? 'Your virtual figure preview will appear here after generation.' : 'Upload a collectible photo before generating a virtual figure.'}
          </div>
        ) : null}
      </div>

      {ready && !hasModel && (
        <p className="mt-3 text-xs leading-relaxed text-cabinet-muted">
          This is currently a local display preview. A rotatable 3D model will appear here when full 3D generation is connected.
        </p>
      )}

      {hasModel && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs text-cabinet-muted">Viewing Angle</span>
          <input
            type="range"
            min="-36"
            max="36"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
            className="w-full accent-[var(--color-cabinet-gold)]"
          />
          <span className="mt-1 block text-xs leading-relaxed text-cabinet-muted">
            The local version is a 2.5D preview. Full rotation will be available when GLB models are connected.
          </span>
        </label>
      )}
    </section>
  )
}
