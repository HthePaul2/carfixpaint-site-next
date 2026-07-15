import type { Metadata } from 'next'

import { HomePage } from '@/components/pages/HomePage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHomepageData } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildAutoRepairSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('home')
}

export default async function Page() {
  const [data, settings] = await Promise.all([getHomepageData(), getSiteSeoSettings()])

  return (
    <>
      <JsonLd data={buildAutoRepairSchema(settings)} />
      <HomePage {...data} portfolioProjects={[]} />
    </>
  )
}
