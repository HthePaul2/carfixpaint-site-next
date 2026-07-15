import type { Metadata } from 'next'

import { TermsPage } from '@/components/pages/AllPages'
import { getLegalPages } from '@/lib/queries'
import { createLegalPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createLegalPageMetadata('terms')
}

export default async function Page() {
  const legal = await getLegalPages()
  return <TermsPage content={legal} />
}
