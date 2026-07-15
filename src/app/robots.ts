import type { MetadataRoute } from 'next'

import { getSiteSeoSettings } from '@/lib/seo/site-settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSeoSettings()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  }
}
