import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServiceDetailPage } from '@/components/pages/ServiceDetailPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getServiceByPageSlug } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { STATIC_PAGE_SEO } from '@/lib/seo/static-pages'
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
  combineSchemas,
} from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ pageSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageSlug } = await params
  const service = await getServiceByPageSlug(pageSlug)

  if (!service) {
    return {
      title: { absolute: STATIC_PAGE_SEO.servicii.title },
      description: STATIC_PAGE_SEO.servicii.description,
    }
  }

  const settings = await getSiteSeoSettings()

  return buildPageMetadata(
    {
      title: service.seoTitle ?? `${service.heroTitle} | CarFix Paint`,
      description: service.seoDescription ?? service.intro,
      path: `/servicii/${service.pageSlug}`,
      keywords: STATIC_PAGE_SEO.servicii.keywords,
      ogImage: service.ogImage,
    },
    settings,
  )
}

export default async function Page({ params }: PageProps) {
  const { pageSlug } = await params
  const service = await getServiceByPageSlug(pageSlug)

  if (!service) {
    notFound()
  }

  const settings = await getSiteSeoSettings()
  const schema = combineSchemas(
    buildBreadcrumbSchema(settings, [
      { name: 'Acasă', path: '/' },
      { name: 'Servicii', path: '/servicii' },
      { name: service.heroTitle },
    ]),
    buildServiceSchema(settings, service),
  )

  return (
    <>
      <JsonLd data={schema} />
      <ServiceDetailPage service={service} />
    </>
  )
}
