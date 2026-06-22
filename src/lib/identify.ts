import type { CategoryId } from '../types'

export interface IdentificationResult {
  name?: string
  series?: string
  character?: string
  category?: CategoryId
}

export async function identifyCollectible(
  file: File,
  imageDataUrl: string,
): Promise<IdentificationResult> {
  const remote = await identifyWithRemoteSearch(file, imageDataUrl)
  if (remote) return remote

  return identifyFromFileName(file.name)
}

async function identifyWithRemoteSearch(
  file: File,
  imageDataUrl: string,
): Promise<IdentificationResult | null> {
  try {
    const response = await fetch('/api/identify-collectible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        imageDataUrl,
      }),
    })
    if (!response.ok) return null
    const result = (await response.json()) as IdentificationResult
    if (!result.name && !result.series && !result.character) return null
    return result
  } catch {
    return null
  }
}

function identifyFromFileName(fileName: string): IdentificationResult {
  const clean = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    name: clean,
  }
}
