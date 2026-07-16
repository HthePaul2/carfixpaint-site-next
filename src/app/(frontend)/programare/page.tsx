import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AppointmentPage } from '@/components/pages/AppointmentPage'
import { getServices, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('programare')
}

export default async function Page() {
  const [services, staticPages] = await Promise.all([getServices(), getStaticPages()])
  const serviceOptions = services.map((service) => ({
    value: service.slug,
    label: service.name,
  }))

  return (
    <Suspense fallback={<div className="container py-16">Se încarcă...</div>}>
      <AppointmentPage content={staticPages.programare} serviceOptions={serviceOptions} />
    </Suspense>
  )
}
