import type { Media } from '@/payload-types'

export function getMediaUrl(
  media: number | Media | null | undefined,
  size?: 'thumbnail' | 'card' | 'hero',
): string | undefined {
  if (!media || typeof media === 'number') return undefined

  if (size && media.sizes?.[size]?.url) {
    return media.sizes[size].url ?? undefined
  }

  return media.url ?? undefined
}

export function resolveImageUrl(
  media: number | Media | null | undefined,
  legacyUrl?: string | null,
  size?: 'thumbnail' | 'card' | 'hero',
): string {
  return getMediaUrl(media, size) ?? legacyUrl ?? '/placeholder-image.svg'
}
