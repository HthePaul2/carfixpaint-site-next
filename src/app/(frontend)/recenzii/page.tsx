import type { Metadata } from 'next'

import { ReviewsPage } from '@/components/pages/AllPages'
import { JsonLd } from '@/components/seo/JsonLd'
import { getApprovedReviews, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildReviewsSchema } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('recenzii')
}

export default async function Page() {
  const [reviews, staticPages, settings] = await Promise.all([
    getApprovedReviews(),
    getStaticPages(),
    getSiteSeoSettings(),
  ])
  const schema = buildReviewsSchema(settings, reviews)

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <ReviewsPage content={staticPages.recenzii} reviews={reviews} />
    </>
  )
}
