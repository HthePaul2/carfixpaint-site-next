import blogPostsJson from '../../content/blog-posts.json'
import faqsJson from '../../content/faqs.json'
import homepageJson from '../../content/homepage.json'
import legalPagesJson from '../../content/legal-pages.json'
import portfolioJson from '../../content/portfolio.json'
import reviewsJson from '../../content/reviews.json'
import servicesJson from '../../content/services.json'
import siteSettingsJson from '../../content/site-settings.json'
import staticPagesJson from '../../content/static-pages.json'

import type { HomepageView, StaticPagesView } from '@/lib/cms-types'
import type {
  SeedBlogPost,
  SeedFaqItem,
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

export const SITE_SETTINGS = siteSettingsJson
export const HOMEPAGE_CONTENT = homepageJson as HomepageView
export const STATIC_PAGES_CONTENT = {
  ...staticPagesJson,
  despre: {
    ...staticPagesJson.despre,
    valuesContent: null,
  },
} as StaticPagesView
export const SERVICES = servicesJson as SeedService[]
export const PORTFOLIO_PROJECTS = portfolioJson as SeedPortfolioProject[]
export const BLOG_POSTS = blogPostsJson as SeedBlogPost[]
export const REVIEWS = reviewsJson as SeedReview[]
export const FAQ_ITEMS = faqsJson as SeedFaqItem[]
export const LEGAL_PAGES_CONTENT = legalPagesJson as LegalPagesContent
