'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import type { RecenziiPageView, ReviewsPageResult, ReviewsSort } from '@/lib/cms-types'

type ReviewsPageProps = {
  content: RecenziiPageView
  result: ReviewsPageResult
}

function formatAverage(value: number): string {
  return value.toLocaleString('ro-RO', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function buildReviewsHref(input: {
  page?: number
  rating?: number
  withText?: boolean
  sort?: ReviewsSort
}): string {
  const params = new URLSearchParams()

  if (input.page && input.page > 1) params.set('page', String(input.page))
  if (input.rating) params.set('rating', String(input.rating))
  if (input.withText) params.set('withText', '1')
  if (input.sort && input.sort !== 'newest') params.set('sort', input.sort)

  const query = params.toString()
  return query ? `/recenzii?${query}` : '/recenzii'
}

function ReviewBody({ rating, text, hasComment }: { rating: number; text: string; hasComment: boolean }) {
  if (!hasComment) {
    return (
      <p className="mb-4 text-sm text-muted-foreground">
        Evaluare de {rating} {rating === 1 ? 'stea' : 'stele'} fără comentariu public.
      </p>
    )
  }

  return <p className="mb-4 text-sm leading-relaxed">{text}</p>
}

export function ReviewsPage({ content, result }: ReviewsPageProps) {
  const { filters, docs, ratingCounts, averageRating, totalApproved } = result

  const availableRatings = useMemo(
    () => ([5, 4, 3, 2, 1] as const).filter((value) => ratingCounts[value] > 0 || value >= 3),
    [ratingCounts],
  )

  const summaryLabel = `${formatAverage(averageRating)}/5 din ${totalApproved} de recenzii Google verificate`

  return (
    <div className="py-16">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{summaryLabel}</p>
          {content.pageSubtitle ? (
            <p className="mt-3 text-sm text-muted-foreground">{content.pageSubtitle}</p>
          ) : null}
        </div>

        <div className="mx-auto mb-10 flex max-w-6xl flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtre rating">
            <FilterChip
              href={buildReviewsHref({
                withText: filters.withText,
                sort: filters.sort,
              })}
              active={!filters.rating}
              label={`Toate (${totalApproved})`}
            />
            {availableRatings.map((value) => (
              <FilterChip
                key={value}
                href={buildReviewsHref({
                  rating: value,
                  withText: filters.withText,
                  sort: filters.sort,
                })}
                active={filters.rating === value}
                label={`${value}★ (${ratingCounts[value] ?? 0})`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtre text și sortare">
            <FilterChip
              href={buildReviewsHref({
                rating: filters.rating,
                withText: !filters.withText,
                sort: filters.sort,
              })}
              active={filters.withText}
              label="Doar cu comentariu"
            />
            <FilterChip
              href={buildReviewsHref({
                rating: filters.rating,
                withText: filters.withText,
                sort: 'newest',
              })}
              active={filters.sort === 'newest'}
              label="Cele mai noi"
            />
            <FilterChip
              href={buildReviewsHref({
                rating: filters.rating,
                withText: filters.withText,
                sort: 'rating-desc',
              })}
              active={filters.sort === 'rating-desc'}
              label="Rating descrescător"
            />
            <FilterChip
              href={buildReviewsHref({
                rating: filters.rating,
                withText: filters.withText,
                sort: 'rating-asc',
              })}
              active={filters.sort === 'rating-asc'}
              label="Rating crescător"
            />
          </div>
        </div>

        {docs.length === 0 ? (
          <EmptyState message="Nu există recenzii pentru filtrele selectate." />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-1" aria-label={`Rating ${review.rating} din 5`}>
                      {Array.from({ length: review.rating }, (_, index) => (
                        <span key={index} className="text-xl text-accent">
                          ★
                        </span>
                      ))}
                    </div>
                    <ReviewBody
                      rating={review.rating}
                      text={review.text}
                      hasComment={review.hasComment}
                    />
                    <div className="border-t pt-4">
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.service} • {review.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {result.totalPages > 1 ? (
          <nav
            className="mx-auto mt-12 flex max-w-6xl items-center justify-center gap-3"
            aria-label="Paginare recenzii"
          >
            {result.hasPrevPage ? (
              <Link
                href={buildReviewsHref({
                  page: result.page - 1,
                  rating: filters.rating,
                  withText: filters.withText,
                  sort: filters.sort,
                })}
                className="rounded-md border px-4 py-2 text-sm hover:bg-secondary"
              >
                Înapoi
              </Link>
            ) : (
              <span className="rounded-md border px-4 py-2 text-sm text-muted-foreground opacity-50">
                Înapoi
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              Pagina {result.page} din {result.totalPages}
            </span>
            {result.hasNextPage ? (
              <Link
                href={buildReviewsHref({
                  page: result.page + 1,
                  rating: filters.rating,
                  withText: filters.withText,
                  sort: filters.sort,
                })}
                className="rounded-md border px-4 py-2 text-sm hover:bg-secondary"
              >
                Înainte
              </Link>
            ) : (
              <span className="rounded-md border px-4 py-2 text-sm text-muted-foreground opacity-50">
                Înainte
              </span>
            )}
          </nav>
        ) : null}
      </div>
    </div>
  )
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground'
          : 'rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary'
      }
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}
