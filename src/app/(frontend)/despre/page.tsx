import type { Metadata } from 'next'

import { AboutPage } from '@/components/pages/AllPages'
import { JsonLd } from '@/components/seo/JsonLd'
import { getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildAboutPageSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('despre')
}

export default async function Page() {
  const [staticPages, settings] = await Promise.all([getStaticPages(), getSiteSeoSettings()])

  return (
    <>
      <JsonLd data={buildAboutPageSchema(settings)} />
      <AboutPage content={staticPages.despre} />
    </>
  )
}
