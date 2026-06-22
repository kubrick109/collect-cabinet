export type VirtualFigureProviderId = 'local-mock' | 'meshy' | 'hunyuan3d' | 'triposr'

export interface VirtualFigureJob {
  provider: VirtualFigureProviderId
  jobId: string
  modelUrl: string | null
}

export interface VirtualFigureInput {
  itemId: string
  name: string
  imageDataUrl: string
}

const ACTIVE_PROVIDER: VirtualFigureProviderId = 'local-mock'

export async function createVirtualFigureJob(
  input: VirtualFigureInput,
): Promise<VirtualFigureJob> {
  if (ACTIVE_PROVIDER === 'local-mock') {
    return createLocalMockJob(input)
  }

  const response = await fetch('/api/virtual-figures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: ACTIVE_PROVIDER,
      itemId: input.itemId,
      name: input.name,
      imageDataUrl: input.imageDataUrl,
    }),
  })

  if (!response.ok) {
    throw new Error('virtual figure job failed')
  }

  return (await response.json()) as VirtualFigureJob
}

async function createLocalMockJob(input: VirtualFigureInput): Promise<VirtualFigureJob> {
  await wait(700)
  return {
    provider: 'local-mock',
    jobId: `local-${input.itemId}-${Date.now()}`,
    modelUrl: null,
  }
}

export async function waitForVirtualFigure(job: VirtualFigureJob): Promise<VirtualFigureJob> {
  if (job.provider === 'local-mock') {
    await wait(1100)
    return job
  }

  const response = await fetch(`/api/virtual-figures/${job.jobId}`)
  if (!response.ok) {
    throw new Error('virtual figure polling failed')
  }

  return (await response.json()) as VirtualFigureJob
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
