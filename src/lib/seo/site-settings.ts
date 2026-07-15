import { cache } from 'react'

import { defaultSiteInfo } from '@/lib/defaults'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

const PUBLIC_READ = { overrideAccess: false as const }

const DEFAULT_COORDINATES = { lat: 45.6579, lng: 25.6012 }

export type SiteSeoSettings = {
  siteName: string
  siteUrl: string
  defaultOgImage: string
  phone: string
  email: string
  address: string
  schedule: string
  coordinates: { lat: number; lng: number }
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '')
}

function resolveDefaultSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000')
}

function toAbsoluteAssetUrl(siteUrl: string, asset?: string): string {
  if (!asset) return `${siteUrl}/og-image.jpg`
  if (asset.startsWith('http://') || asset.startsWith('https://')) return asset
  return `${siteUrl}${asset.startsWith('/') ? asset : `/${asset}`}`
}

function formatPhoneForSchema(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('40')) return `+${digits}`
  if (digits.startsWith('0')) return `+4${digits}`
  return `+${digits}`
}

export const getSiteSeoSettings = cache(async (): Promise<SiteSeoSettings> => {
  const fallbackUrl = resolveDefaultSiteUrl()

  try {
    const payload = await getPayloadClient()
    const global = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      ...PUBLIC_READ,
    })

    const siteUrl = normalizeSiteUrl(global?.canonicalDomain ?? fallbackUrl)
    const ogFromMedia = getMediaUrl(global?.defaultOgImage, 'hero')

    return {
      siteName: global?.companyName ?? defaultSiteInfo.name,
      siteUrl,
      defaultOgImage: toAbsoluteAssetUrl(siteUrl, ogFromMedia),
      phone: global?.phone ?? defaultSiteInfo.phone,
      email: global?.email ?? defaultSiteInfo.email,
      address: global?.address ?? defaultSiteInfo.address,
      schedule: global?.schedule ?? defaultSiteInfo.schedule,
      coordinates: {
        lat: global?.coordinates?.lat ?? DEFAULT_COORDINATES.lat,
        lng: global?.coordinates?.lng ?? DEFAULT_COORDINATES.lng,
      },
    }
  } catch {
    return {
      siteName: defaultSiteInfo.name,
      siteUrl: fallbackUrl,
      defaultOgImage: `${fallbackUrl}/og-image.jpg`,
      phone: defaultSiteInfo.phone,
      email: defaultSiteInfo.email,
      address: defaultSiteInfo.address,
      schedule: defaultSiteInfo.schedule,
      coordinates: DEFAULT_COORDINATES,
    }
  }
})

export function getSchemaPhone(settings: SiteSeoSettings): string {
  return formatPhoneForSchema(settings.phone)
}
