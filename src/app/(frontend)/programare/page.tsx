import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AppointmentPage } from '@/components/pages/AppointmentPage'
import { getServices } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSeoSettings()
  return buildPageMetadata(
    {
      title: 'Programare service auto Brașov | Car Fix & Paint',
      description:
        'Solicită online o programare pentru constatare, diagnoză sau evaluarea mașinii la Car Fix & Paint Brașov.',
      path: '/programare',
      keywords: 'programare service auto Brașov, constatare auto, programare CarFix Paint',
    },
    settings,
  )
}

export default async function Page() {
  const services = await getServices()
  const serviceOptions = services.map((service) => ({
    value: service.slug,
    label: service.name,
  }))

  return (
    <Suspense fallback={<div className="container py-16">Se încarcă...</div>}>
      <AppointmentPage serviceOptions={serviceOptions} />
    </Suspense>
  )
}
