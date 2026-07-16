export interface SeedService {
  id: string
  pageSlug?: string
  name: string
  icon: string
  shortDescription?: string
  description: string
  features: string[]
  heroTitle?: string
  heroSubtitle?: string
  intro?: string
  whenNeededTitle?: string
  whenNeededItems?: string[]
  processTitle?: string
  processSteps?: { title: string; description: string }[]
  ctaTitle?: string
  ctaDescription?: string
  ctaPrimaryLabel?: string
  ctaSecondaryLabel?: string
  featured?: boolean
  active?: boolean
  order?: number
  seoTitle?: string
  seoDescription?: string
}

export interface SeedGoogleReview {
  id: string
  name: string
  rating: number
  text?: string
  date: string
  sourceDateLabel?: string
  service: string
  source: 'google' | 'facebook' | 'direct' | 'other'
  sourceUrl?: string
  consentConfirmed?: boolean
  verified?: boolean
  approved?: boolean
  featured?: boolean
  order?: number
}

export interface SeedReview {
  id: string
  name: string
  rating: number
  text?: string
  hasComment?: boolean
  date: string
  sourceDateLabel?: string
  service: string
  source: 'google' | 'facebook' | 'direct' | 'other'
  sourceUrl?: string
  consentConfirmed?: boolean
  verified?: boolean
  approved?: boolean
  featured?: boolean
  order?: number
}

export interface SeedPortfolioProject {
  id: string
  slug?: string
  title: string
  description: string
  services: string[]
  beforeImage?: string
  afterImage?: string
  ogImage?: string
  duration: string
  vehicleBrand?: string
  vehicleModel?: string
  featured?: boolean
  published?: boolean
  order?: number
  seoTitle?: string
  seoDescription?: string
}

export interface SeedBlogPost {
  id: string
  slug?: string
  title: string
  excerpt: string
  content?: string
  date: string
  readTime: string
  image?: string
  category?: 'guides' | 'tips' | 'insurance' | 'maintenance' | 'general'
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
}

export interface SeedFaqItem {
  question: string
  answer: string
  category?: 'services' | 'insurance' | 'pricing' | 'general'
  published?: boolean
  order?: number
}
