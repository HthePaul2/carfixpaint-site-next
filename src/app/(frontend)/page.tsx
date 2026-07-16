import type { Metadata } from 'next'

import { HomePage } from '@/components/pages/HomePage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHomepageData, getSiteSettings } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildAutoRepairSchema } from '@/lib/structured-data'

/** ISR — avoid force-dynamic so TTFB stays low under PageSpeed throttling. */
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('home')
}

export default async function Page() {
  const [data, settings, company] = await Promise.all([
    getHomepageData(),
    getSiteSeoSettings(),
    getSiteSettings(),
  ])

  return (
    <>
      {/* Preload LCP image early — static file, no /_next/image hop */}
      <link
        rel="preload"
        as="image"
        href="/hero-mobile.avif"
        type="image/avif"
        fetchPriority="high"
        media="(max-width: 768px)"
      />
      <link
        rel="preload"
        as="image"
        href="/hero-mobile.webp"
        type="image/webp"
        fetchPriority="high"
        media="(max-width: 768px)"
      />
      <JsonLd data={buildAutoRepairSchema(settings)} />
      <HomePage {...data} portfolioProjects={[]} company={company} />
    </>
  )
}
