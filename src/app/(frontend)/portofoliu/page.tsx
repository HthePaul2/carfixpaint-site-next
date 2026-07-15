import type { Metadata } from 'next'

import { IllustrativePortfolioPage } from '@/components/pages/IllustrativePortfolioPage'
import { getPortfolioProjects, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('portofoliu')
}

export default async function Page() {
  const [projects, staticPages] = await Promise.all([getPortfolioProjects(), getStaticPages()])

  return <IllustrativePortfolioPage content={staticPages.portofoliu} projects={projects} />
}
