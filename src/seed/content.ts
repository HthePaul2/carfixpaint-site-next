import aboutPageJson from '../../content/about-page.json'
import blogPostsJson from '../../content/blog-posts.json'
import faqsJson from '../../content/faqs.json'
import homepageJson from '../../content/homepage.json'
import legalPagesJson from '../../content/legal-pages.json'
import portfolioJson from '../../content/portfolio.json'
import googleReviews001037 from '../../content/reviews/google-001-037.json'
import googleReviews038074 from '../../content/reviews/google-038-074.json'
import googleReviews075111 from '../../content/reviews/google-075-111.json'
import googleReviews112148 from '../../content/reviews/google-112-148.json'
import servicesJson from '../../content/services.json'
import siteSettingsJson from '../../content/site-settings.json'
import staticPagesJson from '../../content/static-pages.json'

import type { HomepageView, StaticPagesView } from '@/lib/cms-types'
import type {
  SeedBlogPost,
  SeedFaqItem,
  SeedGoogleReview,
  SeedPortfolioProject,
  SeedReview,
  SeedService,
} from '@/seed/types'

export type LegalSection = {
  title: string
  paragraphs: string[]
}

export type LegalPagesContent = {
  privacyTitle: string
  privacySeoTitle: string
  privacySeoDescription: string
  privacySections: LegalSection[]
  cookiesTitle: string
  cookiesSeoTitle: string
  cookiesSeoDescription: string
  cookiesSections: LegalSection[]
  termsTitle: string
  termsSeoTitle: string
  termsSeoDescription: string
  termsSections: LegalSection[]
}

const googleReviews = [
  ...googleReviews001037,
  ...googleReviews038074,
  ...googleReviews075111,
  ...googleReviews112148,
] as SeedGoogleReview[]

const orderedGoogleReviews = [...googleReviews].sort((left, right) => {
  const featuredDifference = Number(Boolean(right.featured)) - Number(Boolean(left.featured))
  if (featuredDifference !== 0) return featuredDifference
  return (left.order ?? 0) - (right.order ?? 0)
})

export const SITE_SETTINGS = siteSettingsJson
export const HOMEPAGE_CONTENT = homepageJson as HomepageView
export const STATIC_PAGES_CONTENT = {
  ...staticPagesJson,
  despre: {
    ...aboutPageJson,
    valuesContent: null,
  },
} as StaticPagesView
export const SERVICES = servicesJson as SeedService[]
export const PORTFOLIO_PROJECTS = portfolioJson as SeedPortfolioProject[]
export const BLOG_POSTS = blogPostsJson as SeedBlogPost[]
export const REVIEWS = orderedGoogleReviews.map((review, index) => {
  const comment = review.text?.trim() ?? ''
  const hasComment = comment.length > 0

  return {
    ...review,
    text: hasComment ? comment : '',
    hasComment,
    order: index,
  }
}) as SeedReview[]
export const FAQ_ITEMS = faqsJson as SeedFaqItem[]
export const LEGAL_PAGES_CONTENT = legalPagesJson as LegalPagesContent
