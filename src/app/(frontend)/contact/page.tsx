import type { Metadata } from 'next'

import { ContactPage } from '@/components/pages/ContactPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getServices, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildContactPageSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('contact')
}

export default async function Page() {
  const [services, staticPages, settings] = await Promise.all([
    getServices(),
    getStaticPages(),
    getSiteSeoSettings(),
  ])
  const serviceOptions = [
    ...services.map((service) => ({
      value: service.slug,
      label: service.name,
    })),
    { value: 'altele', label: 'Altele' },
  ]

  return (
    <>
      <JsonLd data={buildContactPageSchema(settings)} />
      <ContactPage content={staticPages.contact} serviceOptions={serviceOptions} />
    </>
  )
}
