import type { Metadata } from 'next'

import { getResolvedPageSeo } from '@/lib/queries'
import { getSiteSeoSettings, type SiteSeoSettings } from '@/lib/seo/site-settings'
import type { StaticPageKey } from '@/lib/seo/static-pages'

type BuildPageMetadataInput = {
  title: string
  description: string
  path: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
  siteSettings?: SiteSeoSettings
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function resolveOgImage(siteUrl: string, defaultOgImage: string, image?: string): string {
  if (!image) return defaultOgImage
  return toAbsoluteUrl(siteUrl, image)
}

export function buildPageMetadata(
  input: BuildPageMetadataInput,
  settings: SiteSeoSettings,
): Metadata {
  const canonical = toAbsoluteUrl(settings.siteUrl, input.path)
  const ogImage = resolveOgImage(settings.siteUrl, settings.defaultOgImage, input.ogImage)
  const ogTitle = input.ogTitle ?? input.title
  const ogDescription = input.ogDescription ?? input.description

  return {
    title: { absolute: input.title },
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: settings.siteName,
      locale: 'ro_RO',
      type: input.ogType ?? 'website',
      images: [
        {
          url: ogImage,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export async function createStaticPageMetadata(page: StaticPageKey): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getResolvedPageSeo(page), getSiteSeoSettings()])

  return buildPageMetadata(
    {
      title: seo.title,
      description: seo.description,
      path: seo.path,
      keywords: seo.keywords,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
    },
    settings,
  )
}

export async function createLegalPageMetadata(
  page: 'privacy' | 'cookies' | 'terms',
): Promise<Metadata> {
  return createStaticPageMetadata(page)
}
