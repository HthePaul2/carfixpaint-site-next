import type { Metadata } from 'next'

import { ServicesPage } from '@/components/pages/ServicesPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getServices, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildServicesSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('servicii')
}

export default async function Page() {
  const [services, staticPages, settings] = await Promise.all([
    getServices(),
    getStaticPages(),
    getSiteSeoSettings(),
  ])
  const schema = buildServicesSchema(settings, services)

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <ServicesPage content={staticPages.servicii} services={services} />
    </>
  )
}
