import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'

import { PortfolioDetailPage } from '@/components/pages/PortfolioDetailPage'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  getPortfolioProjectByLegacyId,
  getPortfolioProjectBySlug,
} from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { STATIC_PAGE_SEO } from '@/lib/seo/static-pages'
import {
  buildBreadcrumbSchema,
  buildPortfolioProjectSchema,
  combineSchemas,
} from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)

  if (!project) {
    return {
      title: { absolute: STATIC_PAGE_SEO.portofoliu.title },
      description: STATIC_PAGE_SEO.portofoliu.description,
    }
  }

  const settings = await getSiteSeoSettings()

  return buildPageMetadata(
    {
      title: project.seoTitle ?? `${project.title} - Portofoliu CarFix Paint`,
      description: project.seoDescription ?? project.description,
      path: `/portofoliu/${project.slug}`,
      keywords: STATIC_PAGE_SEO.portofoliu.keywords,
      ogImage: project.ogImage ?? project.afterImage,
    },
    settings,
  )
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  let project = await getPortfolioProjectBySlug(slug)

  if (!project && /^\d+$/.test(slug)) {
    const legacyProject = await getPortfolioProjectByLegacyId(slug)
    if (legacyProject) {
      if (legacyProject.slug !== slug) {
        redirect(`/portofoliu/${legacyProject.slug}`)
      }
      project = legacyProject
    }
  }

  if (!project) {
    notFound()
  }

  const settings = await getSiteSeoSettings()
  const schema = combineSchemas(
    buildBreadcrumbSchema(settings, [
      { name: 'Acasă', path: '/' },
      { name: 'Portofoliu', path: '/portofoliu' },
      { name: project.title },
    ]),
    buildPortfolioProjectSchema(settings, project),
  )

  return (
    <>
      <JsonLd data={schema} />
      <PortfolioDetailPage project={project} />
    </>
  )
}
