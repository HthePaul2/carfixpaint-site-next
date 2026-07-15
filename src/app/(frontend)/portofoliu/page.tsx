import type { Metadata } from 'next'

import { PortfolioPage } from '@/components/pages/AllPages'
import { getPortfolioProjects, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('portofoliu')
}

export default async function Page() {
  const [projects, staticPages] = await Promise.all([getPortfolioProjects(), getStaticPages()])
  return <PortfolioPage content={staticPages.portofoliu} projects={projects} />
}
