import type { Metadata } from 'next'

import { DaunePage } from '@/components/pages/AllPages'
import { getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('daune')
}

export default async function Page() {
  const staticPages = await getStaticPages()
  return <DaunePage content={staticPages.daune} />
}
