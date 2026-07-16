import { getPayloadClient } from '@/lib/payload'
import { defaultHomepage, defaultSiteInfo, defaultStaticPages } from '@/lib/defaults'
import type {
  BlogPostDetailView,
  BlogPostListView,
  FAQView,
  HomepageView,
  LegalPagesView,
  PortfolioProjectView,
  ReviewView,
  ReviewsPageResult,
  ServiceView,
  SiteInfoView,
  StaticPagesView,
} from '@/lib/cms-types'
import {
  mapBlogPostDetail,
  mapBlogPostList,
  mapFaq,
  mapHomepage,
  mapLegalPages,
  mapPortfolioProject,
  mapReview,
  mapService,
  mapSiteSettings,
  mapStaticPages,
} from '@/lib/mappers'
import { DEFAULT_PAGE_SEO, type StaticPageKey } from '@/lib/seo/static-pages'
import type { Where } from 'payload'

const PUBLIC_READ = { overrideAccess: false as const }

export async function getSiteSettings(): Promise<SiteInfoView> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    ...PUBLIC_READ,
  })

  if (!global?.phone) return defaultSiteInfo
  return mapSiteSettings(global, defaultSiteInfo)
}

export async function getHomepage(): Promise<HomepageView> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug: 'homepage',
    depth: 1,
    ...PUBLIC_READ,
  })

  return mapHomepage(global, defaultHomepage)
}

export async function getStaticPages(): Promise<StaticPagesView> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug: 'static-pages',
    depth: 1,
    ...PUBLIC_READ,
  })

  return mapStaticPages(global, defaultStaticPages)
}

export async function getServices(limit = 50): Promise<ServiceView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    sort: 'order',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapService)
}

export async function getFeaturedServices(limit = 6): Promise<ServiceView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: {
      and: [{ active: { equals: true } }, { featured: { equals: true } }],
    },
    sort: 'order',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  if (result.docs.length) return result.docs.map(mapService)
  return getServices(limit)
}

export async function getServiceByPageSlug(pageSlug: string): Promise<ServiceView | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: {
      and: [{ pageSlug: { equals: pageSlug } }, { active: { equals: true } }],
    },
    limit: 1,
    depth: 1,
    ...PUBLIC_READ,
  })

  const doc = result.docs[0]
  return doc ? mapService(doc) : null
}

export async function getPortfolioProjects(limit = 50): Promise<PortfolioProjectView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'portfolio-projects',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 2,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapPortfolioProject)
}

export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProjectView | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'portfolio-projects',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
    ...PUBLIC_READ,
  })

  const doc = result.docs[0]
  if (!doc) return null
  return mapPortfolioProject(doc)
}

export async function getPortfolioProjectByLegacyId(
  legacyId: string,
): Promise<PortfolioProjectView | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'portfolio-projects',
    where: {
      and: [{ legacyId: { equals: legacyId } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
    ...PUBLIC_READ,
  })

  const doc = result.docs[0]
  if (!doc) return null
  return mapPortfolioProject(doc)
}

export async function getBlogPosts(limit = 50): Promise<BlogPostListView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog-posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 2,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapBlogPostList)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetailView | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
    ...PUBLIC_READ,
  })

  const doc = result.docs[0]
  if (!doc) return null
  return mapBlogPostDetail(doc)
}

export async function getBlogPostByLegacyId(legacyId: string): Promise<BlogPostDetailView | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [{ legacyId: { equals: legacyId } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
    ...PUBLIC_READ,
  })

  const doc = result.docs[0]
  if (!doc) return null
  return mapBlogPostDetail(doc)
}

export async function getApprovedReviews(limit = 50): Promise<ReviewView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'reviews',
    where: { approved: { equals: true } },
    sort: '-hasComment,-date',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapReview)
}

export async function getFeaturedReviews(limit = 6): Promise<ReviewView[]> {
  const payload = await getPayloadClient()
  const featured = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { approved: { equals: true } },
        { featured: { equals: true } },
        { hasComment: { equals: true } },
      ],
    },
    sort: '-date',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  if (featured.docs.length) return featured.docs.map(mapReview)

  const fallback = await payload.find({
    collection: 'reviews',
    where: {
      and: [{ approved: { equals: true } }, { hasComment: { equals: true } }],
    },
    sort: '-date',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  return fallback.docs.map(mapReview)
}

type ReviewsPageQuery = {
  page?: number
  limit?: number
  rating?: number
  withText?: boolean
  sort?: 'newest' | 'rating-desc' | 'rating-asc'
}

function buildReviewsWhere(input: { rating?: number; withText?: boolean }): Where {
  const clauses: Where[] = [{ approved: { equals: true } }]

  if (input.rating && input.rating >= 1 && input.rating <= 5) {
    clauses.push({ rating: { equals: input.rating } })
  }

  if (input.withText) {
    clauses.push({ hasComment: { equals: true } })
  }

  return { and: clauses }
}

function resolveReviewsSort(sort: ReviewsPageQuery['sort']): string {
  switch (sort) {
    case 'rating-asc':
      return 'rating,-date'
    case 'rating-desc':
      return '-rating,-date'
    case 'newest':
    default:
      return '-hasComment,-date'
  }
}

export async function getApprovedReviewsPage(
  input: ReviewsPageQuery = {},
): Promise<ReviewsPageResult> {
  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(24, Math.max(1, input.limit ?? 12))
  const sort = input.sort ?? 'newest'
  const withText = Boolean(input.withText)
  const rating =
    input.rating && input.rating >= 1 && input.rating <= 5 ? input.rating : undefined

  const payload = await getPayloadClient()
  const where = buildReviewsWhere({ rating, withText })

  const [result, summary, ...ratingCountResults] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where,
      sort: resolveReviewsSort(sort),
      page,
      limit,
      depth: 1,
      ...PUBLIC_READ,
    }),
    payload.find({
      collection: 'reviews',
      where: { approved: { equals: true } },
      limit: 0,
      depth: 0,
      ...PUBLIC_READ,
    }),
    ...([1, 2, 3, 4, 5] as const).map((value) =>
      payload.find({
        collection: 'reviews',
        where: {
          and: [{ approved: { equals: true } }, { rating: { equals: value } }],
        },
        limit: 0,
        depth: 0,
        ...PUBLIC_READ,
      }),
    ),
  ])

  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ;([1, 2, 3, 4, 5] as const).forEach((value, index) => {
    ratingCounts[value] = ratingCountResults[index]?.totalDocs ?? 0
  })

  const totalApproved = summary.totalDocs
  const weightedSum = ([1, 2, 3, 4, 5] as const).reduce(
    (sum, value) => sum + value * ratingCounts[value],
    0,
  )
  const averageRating = totalApproved > 0 ? weightedSum / totalApproved : 0

  return {
    docs: result.docs.map(mapReview),
    page: result.page ?? page,
    limit: result.limit ?? limit,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
    hasNextPage: Boolean(result.hasNextPage),
    hasPrevPage: Boolean(result.hasPrevPage),
    ratingCounts,
    averageRating,
    totalApproved,
    filters: {
      rating,
      withText,
      sort,
    },
  }
}

export async function getFAQs(limit = 100): Promise<FAQView[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'faqs',
    where: { published: { equals: true } },
    sort: 'order',
    limit,
    depth: 0,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapFaq)
}

export async function getLegalPages(): Promise<LegalPagesView> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug: 'legal-pages',
    depth: 1,
    ...PUBLIC_READ,
  })

  return mapLegalPages(global)
}

export async function getHomepageData() {
  const [siteSettings, homepage] = await Promise.all([getSiteSettings(), getHomepage()])

  const [services, portfolioProjects, reviews] = await Promise.all([
    getServices(homepage.servicesLimit ?? 6),
    getPortfolioProjects(homepage.portfolioLimit ?? 3),
    getFeaturedReviews(Math.min(6, homepage.reviewsLimit ?? 6)),
  ])

  return {
    siteSettings,
    homepage,
    services,
    portfolioProjects,
    reviews,
  }
}

export async function getResolvedPageSeo(page: StaticPageKey) {
  const defaults = DEFAULT_PAGE_SEO[page]

  if (page === 'home') {
    const homepage = await getHomepage()
    return {
      path: defaults.path,
      title: homepage.seoTitle,
      description: homepage.seoDescription,
      keywords: homepage.seoKeywords,
      ogTitle: homepage.ogTitle,
      ogDescription: homepage.ogDescription,
      ogImage: homepage.ogImage,
    }
  }

  if (page === 'privacy' || page === 'cookies' || page === 'terms') {
    const legal = await getLegalPages()
    const seoMap = {
      privacy: {
        title: legal.privacySeoTitle,
        description: legal.privacySeoDescription,
        keywords: legal.privacySeoKeywords,
        ogImage: legal.privacyOgImage,
      },
      cookies: {
        title: legal.cookiesSeoTitle,
        description: legal.cookiesSeoDescription,
        keywords: legal.cookiesSeoKeywords,
        ogImage: legal.cookiesOgImage,
      },
      terms: {
        title: legal.termsSeoTitle,
        description: legal.termsSeoDescription,
        keywords: legal.termsSeoKeywords,
        ogImage: legal.termsOgImage,
      },
    }[page]

    return {
      path: defaults.path,
      title: seoMap.title,
      description: seoMap.description,
      keywords: seoMap.keywords,
      ogTitle: undefined,
      ogDescription: undefined,
      ogImage: seoMap.ogImage,
    }
  }

  const staticPages = await getStaticPages()
  const pageMap = {
    servicii: staticPages.servicii,
    daune: staticPages.daune,
    portofoliu: staticPages.portofoliu,
    despre: staticPages.despre,
    recenzii: staticPages.recenzii,
    faq: staticPages.faq,
    blog: staticPages.blog,
    contact: staticPages.contact,
  }[page]

  return {
    path: defaults.path,
    title: pageMap.seoTitle,
    description: pageMap.seoDescription,
    keywords: pageMap.seoKeywords,
    ogTitle: pageMap.ogTitle,
    ogDescription: pageMap.ogDescription,
    ogImage: pageMap.ogImage,
  }
}
