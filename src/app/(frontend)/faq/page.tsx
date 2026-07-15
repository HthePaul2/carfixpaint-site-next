import type { Metadata } from 'next'

import { FAQPage } from '@/components/pages/AllPages'
import { JsonLd } from '@/components/seo/JsonLd'
import { getFAQs, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('faq')
}

export default async function Page() {
  const [faqs, staticPages] = await Promise.all([getFAQs(), getStaticPages()])
  const schema = buildFaqPageSchema(faqs)

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <FAQPage content={staticPages.faq} faqs={faqs} />
    </>
  )
}
