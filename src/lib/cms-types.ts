export type NavigationItemView = {
  path: string
  label: string
}

export type SiteInfoView = {
  name: string
  tagline: string
  phone: string
  email: string
  address: string
  schedule: string
  whatsappNumber: string
  whatsappMessage: string
  facebook?: string
  instagram?: string
  logoAbbreviation: string
  footerDescription: string
  footerServices: string[]
  navigationItems: NavigationItemView[]
  copyrightText: string
}

export type PageSeoView = {
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export type HomepageBenefitView = {
  icon: string
  title: string
  description: string
}

export type HomepageStepView = {
  title: string
  description: string
}

export type HomepageView = {
  heroBadge: string
  heroTitle: string
  heroAccentText: string
  heroDescription: string
  heroCtaPhoneLabel: string
  heroCtaQuoteLabel: string
  benefits: HomepageBenefitView[]
  servicesSectionTitle: string
  servicesSectionSubtitle: string
  portfolioSectionTitle: string
  reviewsSectionTitle: string
  servicesLimit: number
  portfolioLimit: number
  reviewsLimit: number
  damageProcessTitle: string
  damageProcessSteps: HomepageStepView[]
  finalCtaTitle: string
  finalCtaDescription: string
  finalCtaButtonLabel: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export type StaticPageHeaderView = {
  pageTitle: string
  pageSubtitle: string
}

export type ServiciiPageView = StaticPageHeaderView & PageSeoView

export type DauneHighlightView = {
  icon: string
  title: string
  description: string
}

export type DaunePageView = StaticPageHeaderView &
  PageSeoView & {
    highlights: DauneHighlightView[]
    processTitle: string
    processSteps: HomepageStepView[]
    ctaTitle: string
    ctaDescription: string
    ctaContactLabel: string
  }

export type PortofoliuPageView = StaticPageHeaderView & PageSeoView

export type DespreStatView = {
  value: string
  label: string
}

export type DesprePageView = PageSeoView & {
  pageTitle: string
  intro: string
  stats: DespreStatView[]
  whyTitle: string
  whyItems: string[]
  missionTitle: string
  missionText: string
  valuesTitle: string
  valuesContent: Record<string, unknown> | null
}

export type RecenziiPageView = StaticPageHeaderView & PageSeoView

export type FaqPageView = StaticPageHeaderView & PageSeoView

export type BlogPageView = StaticPageHeaderView & PageSeoView

export type ContactPageView = StaticPageHeaderView &
  PageSeoView & {
    contactCardTitle: string
    fastResponseTitle: string
    fastResponseText: string
  }

export type StaticPagesView = {
  servicii: ServiciiPageView
  daune: DaunePageView
  portofoliu: PortofoliuPageView
  despre: DesprePageView
  recenzii: RecenziiPageView
  faq: FaqPageView
  blog: BlogPageView
  contact: ContactPageView
}

export type ServiceView = {
  slug: string
  pageSlug: string
  name: string
  icon: string
  description: string
  shortDescription?: string
  features: string[]
  heroTitle: string
  heroSubtitle: string
  intro: string
  whenNeededTitle: string
  whenNeededItems: string[]
  processTitle: string
  processSteps: { title: string; description: string }[]
  ctaTitle: string
  ctaDescription: string
  ctaPrimaryLabel: string
  ctaSecondaryLabel: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
}

export type PortfolioProjectView = {
  slug: string
  legacyId?: string
  title: string
  description: string
  services: string[]
  beforeImage: string
  afterImage: string
  duration: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
}

export type BlogPostListView = {
  slug: string
  legacyId?: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image?: string
}

export type BlogPostDetailView = BlogPostListView & {
  legacyMarkdown?: string
  body?: Record<string, unknown> | null
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
  publishedAt?: string
  updatedAt?: string
}

export type ReviewView = {
  id: string
  name: string
  rating: number
  text: string
  date: string
  service: string
}

export type LegalPagesView = {
  privacyTitle: string
  privacyContent: Record<string, unknown> | null
  privacySeoTitle: string
  privacySeoDescription: string
  privacySeoKeywords: string
  privacyOgImage?: string
  cookiesTitle: string
  cookiesContent: Record<string, unknown> | null
  cookiesSeoTitle: string
  cookiesSeoDescription: string
  cookiesSeoKeywords: string
  cookiesOgImage?: string
  termsTitle: string
  termsContent: Record<string, unknown> | null
  termsSeoTitle: string
  termsSeoDescription: string
  termsSeoKeywords: string
  termsOgImage?: string
}

export type FAQView = {
  question: string
  answer: string
}
