import type {
  BlogPost,
  Faq,
  Homepage,
  LegalPage,
  Media,
  StaticPage,
  PortfolioProject,
  Review,
  Service,
  SiteSetting,
} from '@/payload-types'

import type {
  BlogPostDetailView,
  BlogPostListView,
  ContactPageView,
  DaunePageView,
  DesprePageView,
  FAQView,
  HomepageView,
  LegalPagesView,
  PageSeoView,
  PortfolioProjectView,
  ReviewView,
  ServiceView,
  SiteInfoView,
  StaticPageHeaderView,
  StaticPagesView,
} from '@/lib/cms-types'
import { defaultHomepage, defaultLegalPages, defaultStaticPages } from '@/lib/defaults'
import { getMediaUrl, resolveImageUrl } from '@/lib/media'

function mapServiceNames(services: PortfolioProject['services']): string[] {
  if (!services?.length) return []

  return services.map((service) => {
    if (typeof service === 'number') return 'Serviciu'
    return service.name
  })
}

function mapReviewService(review: Review): string {
  if (review.serviceLabel) return review.serviceLabel
  if (review.service && typeof review.service !== 'number') return review.service.name
  return ''
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  return value.slice(0, 10)
}

function resolveOgImage(media: number | Media | null | undefined): string | undefined {
  return getMediaUrl(media, 'hero')
}

type SeoTextFields = Omit<PageSeoView, 'ogImage'>

function mergeSeo<T extends PageSeoView>(
  fallback: T,
  source?: Partial<Record<keyof SeoTextFields, string | null | undefined>> | null,
  ogImageMedia?: number | Media | null | undefined,
): T {
  if (!source && !ogImageMedia) return fallback

  const resolvedOgImage = resolveOgImage(ogImageMedia)

  return {
    ...fallback,
    seoTitle: source?.seoTitle?.trim() || fallback.seoTitle,
    seoDescription: source?.seoDescription?.trim() || fallback.seoDescription,
    seoKeywords: source?.seoKeywords?.trim() || fallback.seoKeywords,
    ogTitle: source?.ogTitle?.trim() || fallback.ogTitle,
    ogDescription: source?.ogDescription?.trim() || fallback.ogDescription,
    ogImage: resolvedOgImage ?? fallback.ogImage,
  }
}

function mergeHeader<T extends StaticPageHeaderView>(
  fallback: T,
  source?: Partial<Record<keyof StaticPageHeaderView, string | null | undefined>> | null,
): T {
  if (!source) return fallback

  return {
    ...fallback,
    pageTitle: source.pageTitle?.trim() || fallback.pageTitle,
    pageSubtitle: source.pageSubtitle?.trim() || fallback.pageSubtitle,
  }
}

export function mapSiteSettings(global: SiteSetting | null, fallback: SiteInfoView): SiteInfoView {
  if (!global) return fallback

  return {
    name: global.companyName,
    tagline: global.tagline ?? fallback.tagline,
    phone: global.phone,
    email: global.email ?? fallback.email,
    address: global.address ?? fallback.address,
    schedule: global.schedule ?? fallback.schedule,
    whatsappNumber: global.whatsappNumber ?? fallback.whatsappNumber,
    whatsappMessage: global.whatsappMessage ?? fallback.whatsappMessage,
    facebook: global.facebook ?? undefined,
    instagram: global.instagram ?? undefined,
    logoAbbreviation: global.logoAbbreviation?.trim() || fallback.logoAbbreviation,
    footerDescription: global.footerDescription?.trim() || fallback.footerDescription,
    footerServices:
      global.footerServices?.map((item) => item.label).filter(Boolean) ?? fallback.footerServices,
    navigationItems:
      global.navigationItems
        ?.filter((item) => item.path && item.label)
        .map((item) => ({ path: item.path, label: item.label })) ?? fallback.navigationItems,
    copyrightText: global.copyrightText?.trim() || fallback.copyrightText,
  }
}

export function mapHomepage(global: Homepage | null, fallback: HomepageView): HomepageView {
  if (!global) return fallback

  return {
    ...mergeSeo(fallback, global, global.ogImage),
    heroBadge: global.heroBadge ?? fallback.heroBadge,
    heroTitle: global.heroTitle ?? fallback.heroTitle,
    heroAccentText: global.heroAccentText ?? fallback.heroAccentText,
    heroDescription: global.heroDescription ?? fallback.heroDescription,
    heroCtaPhoneLabel: global.heroCtaPhoneLabel ?? fallback.heroCtaPhoneLabel,
    heroCtaQuoteLabel: global.heroCtaQuoteLabel ?? fallback.heroCtaQuoteLabel,
    benefits:
      global.benefits?.map((benefit) => ({
        icon: benefit.icon,
        title: benefit.title,
        description: benefit.description,
      })) ?? fallback.benefits,
    servicesSectionTitle: global.servicesSectionTitle ?? fallback.servicesSectionTitle,
    servicesSectionSubtitle: global.servicesSectionSubtitle ?? fallback.servicesSectionSubtitle,
    portfolioSectionTitle: global.portfolioSectionTitle ?? fallback.portfolioSectionTitle,
    reviewsSectionTitle: global.reviewsSectionTitle ?? fallback.reviewsSectionTitle,
    servicesLimit: global.servicesLimit ?? fallback.servicesLimit,
    portfolioLimit: global.portfolioLimit ?? fallback.portfolioLimit,
    reviewsLimit: global.reviewsLimit ?? fallback.reviewsLimit,
    damageProcessTitle: global.damageProcessTitle ?? fallback.damageProcessTitle,
    damageProcessSteps:
      global.damageProcessSteps?.map((step) => ({
        title: step.title,
        description: step.description,
      })) ?? fallback.damageProcessSteps,
    finalCtaTitle: global.finalCtaTitle ?? fallback.finalCtaTitle,
    finalCtaDescription: global.finalCtaDescription ?? fallback.finalCtaDescription,
    finalCtaButtonLabel: global.finalCtaButtonLabel ?? fallback.finalCtaButtonLabel,
  }
}

export function mapStaticPages(global: StaticPage | null, fallback: StaticPagesView): StaticPagesView {
  if (!global) return fallback

  const servicii = mergeSeo(
    mergeHeader(fallback.servicii, global.servicii),
    global.servicii,
    global.servicii?.ogImage,
  )

  const daune: DaunePageView = {
    ...mergeSeo(mergeHeader(fallback.daune, global.daune), global.daune, global.daune?.ogImage),
    highlights:
      global.daune?.highlights?.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })) ?? fallback.daune.highlights,
    processTitle: global.daune?.processTitle?.trim() || fallback.daune.processTitle,
    processSteps:
      global.daune?.processSteps?.map((step) => ({
        title: step.title,
        description: step.description,
      })) ?? fallback.daune.processSteps,
    ctaTitle: global.daune?.ctaTitle?.trim() || fallback.daune.ctaTitle,
    ctaDescription: global.daune?.ctaDescription?.trim() || fallback.daune.ctaDescription,
    ctaContactLabel: global.daune?.ctaContactLabel?.trim() || fallback.daune.ctaContactLabel,
  }

  const portofoliu = mergeSeo(
    mergeHeader(fallback.portofoliu, global.portofoliu),
    global.portofoliu,
    global.portofoliu?.ogImage,
  )

  const despre: DesprePageView = {
    ...mergeSeo(fallback.despre, global.despre, global.despre?.ogImage),
    pageTitle: global.despre?.pageTitle?.trim() || fallback.despre.pageTitle,
    intro: global.despre?.intro?.trim() || fallback.despre.intro,
    stats:
      global.despre?.stats?.map((stat) => ({
        value: stat.value,
        label: stat.label,
      })) ?? fallback.despre.stats,
    whyTitle: global.despre?.whyTitle?.trim() || fallback.despre.whyTitle,
    whyItems:
      global.despre?.whyItems?.map((item) => item.item).filter(Boolean) ?? fallback.despre.whyItems,
    missionTitle: global.despre?.missionTitle?.trim() || fallback.despre.missionTitle,
    missionText: global.despre?.missionText?.trim() || fallback.despre.missionText,
    valuesTitle: global.despre?.valuesTitle?.trim() || fallback.despre.valuesTitle,
    valuesContent: (global.despre?.valuesContent as Record<string, unknown> | null) ?? null,
  }

  const recenzii = mergeSeo(
    mergeHeader(fallback.recenzii, global.recenzii),
    global.recenzii,
    global.recenzii?.ogImage,
  )

  const faq = mergeSeo(mergeHeader(fallback.faq, global.faq), global.faq, global.faq?.ogImage)

  const blog = mergeSeo(mergeHeader(fallback.blog, global.blog), global.blog, global.blog?.ogImage)

  const contact: ContactPageView = {
    ...mergeSeo(mergeHeader(fallback.contact, global.contact), global.contact, global.contact?.ogImage),
    contactCardTitle:
      global.contact?.contactCardTitle?.trim() || fallback.contact.contactCardTitle,
    fastResponseTitle:
      global.contact?.fastResponseTitle?.trim() || fallback.contact.fastResponseTitle,
    fastResponseText:
      global.contact?.fastResponseText?.trim() || fallback.contact.fastResponseText,
  }

  return {
    servicii,
    daune,
    portofoliu,
    despre,
    recenzii,
    faq,
    blog,
    contact,
  }
}

export function mapService(doc: Service): ServiceView {
  return {
    slug: doc.slug,
    pageSlug: doc.pageSlug,
    name: doc.name,
    icon: doc.icon,
    description: doc.description,
    shortDescription: doc.shortDescription ?? undefined,
    features: doc.features?.map((item) => item.feature) ?? [],
    heroTitle: doc.heroTitle?.trim() || doc.name,
    heroSubtitle: doc.heroSubtitle?.trim() || doc.shortDescription || doc.description,
    intro: doc.intro?.trim() || doc.description,
    whenNeededTitle: doc.whenNeededTitle?.trim() || 'Când este recomandat acest serviciu',
    whenNeededItems: doc.whenNeededItems?.map((entry) => entry.item).filter(Boolean) ?? [],
    processTitle: doc.processTitle?.trim() || 'Cum lucrăm',
    processSteps:
      doc.processSteps
        ?.filter((step) => step.title && step.description)
        .map((step) => ({
          title: step.title,
          description: step.description,
        })) ?? [],
    ctaTitle: doc.ctaTitle?.trim() || `Ai nevoie de ${doc.name.toLowerCase()}?`,
    ctaDescription:
      doc.ctaDescription?.trim() ||
      'Trimite fotografiile pentru o primă evaluare sau solicită o programare pentru constatare.',
    ctaPrimaryLabel: doc.ctaPrimaryLabel?.trim() || 'Trimite poze pentru evaluare',
    ctaSecondaryLabel: doc.ctaSecondaryLabel?.trim() || 'Solicită o programare',
    seoTitle: doc.seoTitle ?? undefined,
    seoDescription: doc.seoDescription ?? undefined,
    ogImage: getMediaUrl(doc.ogImage, 'hero') || undefined,
  }
}

export function mapPortfolioProject(doc: PortfolioProject): PortfolioProjectView {
  const dedicatedOg = getMediaUrl(doc.ogImage, 'hero')

  return {
    slug: doc.slug,
    legacyId: doc.legacyId ?? undefined,
    title: doc.title,
    description: doc.description,
    services: mapServiceNames(doc.services),
    beforeImage: resolveImageUrl(doc.beforeImage, doc.legacyBeforeImageUrl),
    afterImage: resolveImageUrl(doc.afterImage, doc.legacyAfterImageUrl),
    duration: doc.duration ?? '',
    seoTitle: doc.seoTitle ?? undefined,
    seoDescription: doc.seoDescription ?? undefined,
    // Dedicated only — page metadata falls back to portfolioDefaultOgImage, then site default.
    ogImage: dedicatedOg,
  }
}

export function mapBlogPostList(doc: BlogPost): BlogPostListView {
  return {
    slug: doc.slug,
    legacyId: doc.legacyId ?? undefined,
    title: doc.title,
    excerpt: doc.excerpt,
    date: formatDate(doc.publishedAt ?? doc.createdAt),
    readTime: doc.readTime ?? '',
    image: resolveImageUrl(doc.coverImage, doc.legacyCoverImageUrl, 'hero'),
  }
}

export function mapBlogPostDetail(doc: BlogPost): BlogPostDetailView {
  const coverImage = resolveImageUrl(doc.coverImage, doc.legacyCoverImageUrl, 'hero')
  const dedicatedOg = getMediaUrl(doc.ogImage, 'hero')

  return {
    ...mapBlogPostList(doc),
    legacyMarkdown: doc.legacyMarkdown ?? undefined,
    body: doc.body ?? null,
    seoTitle: doc.seoTitle ?? undefined,
    seoDescription: doc.seoDescription ?? undefined,
    ogImage: dedicatedOg ?? (coverImage !== '/placeholder-image.svg' ? coverImage : undefined),
    publishedAt: doc.publishedAt ?? undefined,
    updatedAt: doc.updatedAt ?? undefined,
  }
}

export function mapReview(doc: Review): ReviewView {
  const text = doc.text?.trim() ?? ''
  const hasComment = Boolean(doc.hasComment ?? text.length > 0)

  return {
    id: String(doc.id),
    name: doc.name,
    rating: doc.rating,
    text,
    hasComment,
    date: formatDate(doc.date),
    service: mapReviewService(doc),
  }
}

export function mapFaq(doc: Faq): FAQView {
  return {
    question: doc.question,
    answer: doc.answer,
  }
}

export function mapLegalPages(global: LegalPage | null): LegalPagesView {
  const fallback = defaultLegalPages
  if (!global) return fallback

  return {
    privacyTitle: global.privacyTitle?.trim() || fallback.privacyTitle,
    privacyContent: (global.privacyContent as Record<string, unknown> | null) ?? null,
    privacySeoTitle: global.privacySeoTitle?.trim() || fallback.privacySeoTitle,
    privacySeoDescription: global.privacySeoDescription?.trim() || fallback.privacySeoDescription,
    privacySeoKeywords: fallback.privacySeoKeywords,
    privacyOgImage: resolveOgImage(global.privacyOgImage),
    cookiesTitle: global.cookiesTitle?.trim() || fallback.cookiesTitle,
    cookiesContent: (global.cookiesContent as Record<string, unknown> | null) ?? null,
    cookiesSeoTitle: global.cookiesSeoTitle?.trim() || fallback.cookiesSeoTitle,
    cookiesSeoDescription: global.cookiesSeoDescription?.trim() || fallback.cookiesSeoDescription,
    cookiesSeoKeywords: fallback.cookiesSeoKeywords,
    cookiesOgImage: resolveOgImage(global.cookiesOgImage),
    termsTitle: global.termsTitle?.trim() || fallback.termsTitle,
    termsContent: (global.termsContent as Record<string, unknown> | null) ?? null,
    termsSeoTitle: global.termsSeoTitle?.trim() || fallback.termsSeoTitle,
    termsSeoDescription: global.termsSeoDescription?.trim() || fallback.termsSeoDescription,
    termsSeoKeywords: fallback.termsSeoKeywords,
    termsOgImage: resolveOgImage(global.termsOgImage),
  }
}
