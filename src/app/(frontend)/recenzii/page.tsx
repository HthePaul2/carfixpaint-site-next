import type { Metadata } from 'next'

import { ReviewsPage } from '@/components/pages/ReviewsPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { getApprovedReviewsPage, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { buildReviewsSchema } from '@/lib/structured-data'
import type { ReviewsSort } from '@/lib/cms-types'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function parseSort(value?: string): ReviewsSort {
  if (value === 'rating-asc' || value === 'rating-desc' || value === 'newest') return value
  return 'newest'
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await createStaticPageMetadata('recenzii')
  return {
    ...metadata,
    alternates: {
      ...(metadata.alternates ?? {}),
      canonical: metadata.alternates?.canonical ?? '/recenzii',
    },
  }
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(firstValue(params.page) ?? '1')
  const rating = Number(firstValue(params.rating) ?? '0')
  const withText = firstValue(params.withText) === '1'
  const sort = parseSort(firstValue(params.sort))

  const [result, staticPages, settings] = await Promise.all([
    getApprovedReviewsPage({
      page: Number.isFinite(page) ? page : 1,
      rating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
      withText,
      sort,
    }),
    getStaticPages(),
    getSiteSeoSettings(),
  ])

  const schema = buildReviewsSchema(settings, result.docs, {
    averageRating: result.averageRating,
    reviewCount: result.totalApproved,
  })

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <ReviewsPage content={staticPages.recenzii} result={result} />
    </>
  )
}
