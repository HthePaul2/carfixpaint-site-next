import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import {
  BLOG_POSTS,
  FAQ_ITEMS,
  HOMEPAGE_CONTENT,
  LEGAL_PAGES_CONTENT,
  PORTFOLIO_PROJECTS,
  REVIEWS,
  SERVICES,
  SITE_SETTINGS,
  STATIC_PAGES_CONTENT,
} from '@/seed/content'
import { faqSeedKey, reviewSeedKey, slugify } from '@/seed/slugify'
import { upsertByField, upsertBySlug, upsertGlobal } from '@/seed/upsert'

const SERVICE_LABEL_MAP: Record<string, string> = {
  tinichigerie: 'tinichigerie',
  vopsitorie: 'vopsitorie',
  mecanica: 'mecanica',
  'mecanică auto': 'mecanica',
  diagnoza: 'diagnoza',
  diagnoză: 'diagnoza',
  'daune rca': 'daune-rca-casco',
  'daune casco': 'daune-rca-casco',
  'daune rca/casco': 'daune-rca-casco',
  'mașină la schimb': 'masina-schimb',
}

function resolveServiceSlug(label: string): string | undefined {
  const normalized = label.trim().toLowerCase()

  if (SERVICE_LABEL_MAP[normalized]) return SERVICE_LABEL_MAP[normalized]
  if (normalized.includes('tinichigerie')) return 'tinichigerie'
  if (normalized.includes('vopsitor')) return 'vopsitorie'
  if (normalized.includes('mecanic')) return 'mecanica'
  if (normalized.includes('daune')) return 'daune-rca-casco'
  if (normalized.includes('diagnoz')) return 'diagnoza'
  if (normalized.includes('schimb')) return 'masina-schimb'

  return undefined
}

async function removeStaleDemoContent(payload: Payload) {
  const [demoBlogPosts, demoPortfolioProjects, seededReviews, seededFaqs] = await Promise.all([
    payload.find({
      collection: 'blog-posts',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      where: { legacyCoverImageUrl: { contains: 'images.unsplash.com' } },
    }),
    payload.find({
      collection: 'portfolio-projects',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      where: { legacyBeforeImageUrl: { contains: 'images.unsplash.com' } },
    }),
    payload.find({
      collection: 'reviews',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      where: { seedKey: { exists: true } },
    }),
    payload.find({
      collection: 'faqs',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      where: { seedKey: { exists: true } },
    }),
  ])

  await Promise.all([
    ...demoBlogPosts.docs.map((doc) =>
      payload.delete({ collection: 'blog-posts', id: doc.id, overrideAccess: true }),
    ),
    ...demoPortfolioProjects.docs.map((doc) =>
      payload.delete({ collection: 'portfolio-projects', id: doc.id, overrideAccess: true }),
    ),
    ...seededReviews.docs.map((doc) =>
      payload.delete({ collection: 'reviews', id: doc.id, overrideAccess: true }),
    ),
    ...seededFaqs.docs.map((doc) =>
      payload.delete({ collection: 'faqs', id: doc.id, overrideAccess: true }),
    ),
  ])
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  const serviceIdBySlug = new Map<string, number>()

  console.log('→ Removing stale demo content...')
  await removeStaleDemoContent(payload)

  console.log('→ Seeding site-settings...')
  await upsertGlobal(payload, 'site-settings', {
    companyName: SITE_SETTINGS.companyName,
    tagline: SITE_SETTINGS.tagline,
    phone: SITE_SETTINGS.phone,
    email: SITE_SETTINGS.email,
    address: SITE_SETTINGS.address,
    schedule: SITE_SETTINGS.schedule,
    whatsappNumber: SITE_SETTINGS.whatsappNumber,
    whatsappMessage: SITE_SETTINGS.whatsappMessage,
    canonicalDomain: SITE_SETTINGS.canonicalDomain,
    ctaPhoneLabel: SITE_SETTINGS.ctaPhoneLabel,
    ctaQuoteLabel: SITE_SETTINGS.ctaQuoteLabel,
    logoAbbreviation: SITE_SETTINGS.logoAbbreviation,
    footerDescription: SITE_SETTINGS.footerDescription,
    footerServices: SITE_SETTINGS.footerServices.map((label) => ({ label })),
    navigationItems: SITE_SETTINGS.navigationItems,
    copyrightText: SITE_SETTINGS.copyrightText,
  })

  console.log('→ Seeding homepage...')
  await upsertGlobal(payload, 'homepage', {
    heroBadge: HOMEPAGE_CONTENT.heroBadge,
    heroTitle: HOMEPAGE_CONTENT.heroTitle,
    heroAccentText: HOMEPAGE_CONTENT.heroAccentText,
    heroDescription: HOMEPAGE_CONTENT.heroDescription,
    heroCtaPhoneLabel: HOMEPAGE_CONTENT.heroCtaPhoneLabel,
    heroCtaQuoteLabel: HOMEPAGE_CONTENT.heroCtaQuoteLabel,
    benefits: HOMEPAGE_CONTENT.benefits,
    servicesSectionTitle: HOMEPAGE_CONTENT.servicesSectionTitle,
    servicesSectionSubtitle: HOMEPAGE_CONTENT.servicesSectionSubtitle,
    portfolioSectionTitle: HOMEPAGE_CONTENT.portfolioSectionTitle,
    reviewsSectionTitle: HOMEPAGE_CONTENT.reviewsSectionTitle,
    servicesLimit: HOMEPAGE_CONTENT.servicesLimit,
    portfolioLimit: HOMEPAGE_CONTENT.portfolioLimit,
    reviewsLimit: HOMEPAGE_CONTENT.reviewsLimit,
    damageProcessTitle: HOMEPAGE_CONTENT.damageProcessTitle,
    damageProcessSteps: HOMEPAGE_CONTENT.damageProcessSteps,
    finalCtaTitle: HOMEPAGE_CONTENT.finalCtaTitle,
    finalCtaDescription: HOMEPAGE_CONTENT.finalCtaDescription,
    finalCtaButtonLabel: HOMEPAGE_CONTENT.finalCtaButtonLabel,
    seoTitle: HOMEPAGE_CONTENT.seoTitle,
    seoDescription: HOMEPAGE_CONTENT.seoDescription,
    seoKeywords: HOMEPAGE_CONTENT.seoKeywords,
    ogTitle: HOMEPAGE_CONTENT.ogTitle,
    ogDescription: HOMEPAGE_CONTENT.ogDescription,
  })

  console.log('→ Seeding static pages...')
  await upsertGlobal(payload, 'static-pages', {
    servicii: STATIC_PAGES_CONTENT.servicii,
    daune: {
      ...STATIC_PAGES_CONTENT.daune,
      highlights: STATIC_PAGES_CONTENT.daune.highlights,
      processSteps: STATIC_PAGES_CONTENT.daune.processSteps,
    },
    portofoliu: STATIC_PAGES_CONTENT.portofoliu,
    despre: {
      ...STATIC_PAGES_CONTENT.despre,
      stats: STATIC_PAGES_CONTENT.despre.stats,
      whyItems: STATIC_PAGES_CONTENT.despre.whyItems.map((item) => ({ item })),
      valuesContent: null,
    },
    recenzii: STATIC_PAGES_CONTENT.recenzii,
    faq: STATIC_PAGES_CONTENT.faq,
    blog: STATIC_PAGES_CONTENT.blog,
    contact: STATIC_PAGES_CONTENT.contact,
  })

  console.log('→ Seeding legal page titles and SEO...')
  await upsertGlobal(payload, 'legal-pages', {
    privacyTitle: LEGAL_PAGES_CONTENT.privacyTitle,
    privacySeoTitle: LEGAL_PAGES_CONTENT.privacySeoTitle,
    privacySeoDescription: LEGAL_PAGES_CONTENT.privacySeoDescription,
    privacyContent: null,
    cookiesTitle: LEGAL_PAGES_CONTENT.cookiesTitle,
    cookiesSeoTitle: LEGAL_PAGES_CONTENT.cookiesSeoTitle,
    cookiesSeoDescription: LEGAL_PAGES_CONTENT.cookiesSeoDescription,
    cookiesContent: null,
    termsTitle: LEGAL_PAGES_CONTENT.termsTitle,
    termsSeoTitle: LEGAL_PAGES_CONTENT.termsSeoTitle,
    termsSeoDescription: LEGAL_PAGES_CONTENT.termsSeoDescription,
    termsContent: null,
  })

  console.log('→ Seeding services...')
  for (const [index, service] of SERVICES.entries()) {
    const doc = await upsertBySlug(payload, 'services', service.id, {
      name: service.name,
      icon: service.icon,
      description: service.description,
      shortDescription: service.shortDescription ?? service.description.slice(0, 180),
      features: service.features.map((feature) => ({ feature })),
      active: service.active ?? true,
      featured: service.featured ?? index < 3,
      order: service.order ?? index,
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
    })

    serviceIdBySlug.set(service.id, doc.id as number)
  }

  console.log('→ Seeding portfolio projects as drafts until real photos are available...')
  for (const [index, project] of PORTFOLIO_PROJECTS.entries()) {
    const slug = project.slug ?? slugify(project.title)
    const serviceIds = project.services
      .map((label) => resolveServiceSlug(label))
      .filter((value): value is string => Boolean(value))
      .map((serviceSlug) => serviceIdBySlug.get(serviceSlug))
      .filter((value): value is number => typeof value === 'number')
    const published = project.published ?? false

    await upsertBySlug(
      payload,
      'portfolio-projects',
      slug,
      {
        title: project.title,
        legacyId: project.id,
        description: project.description,
        services: serviceIds,
        legacyBeforeImageUrl: project.beforeImage,
        legacyAfterImageUrl: project.afterImage,
        duration: project.duration,
        vehicleBrand: project.vehicleBrand,
        vehicleModel: project.vehicleModel,
        featured: project.featured ?? index < 3,
        order: project.order ?? index,
        publishedAt: published ? new Date().toISOString() : undefined,
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
        _status: published ? 'published' : 'draft',
      },
      { draft: !published },
    )
  }

  console.log('→ Seeding blog posts...')
  for (const [index, post] of BLOG_POSTS.entries()) {
    const slug = post.slug ?? slugify(post.title)

    await upsertBySlug(
      payload,
      'blog-posts',
      slug,
      {
        title: post.title,
        legacyId: post.id,
        excerpt: post.excerpt,
        legacyMarkdown: post.content ?? '',
        legacyCoverImageUrl: post.image,
        readTime: post.readTime,
        category: post.category ?? 'general',
        featured: post.featureured ?? post.featured ?? index === 0,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        publishedAt: new Date(post.date).toISOString(),
        _status: 'published',
      },
      { draft: false },
    )
  }

  console.log('→ Seeding verified reviews, if provided...')
  for (const [index, review] of REVIEWS.entries()) {
    const seedKey = reviewSeedKey(review.name, review.date)
    const serviceSlug = resolveServiceSlug(review.service)
    const serviceId = serviceSlug ? serviceIdBySlug.get(serviceSlug) : undefined

    await upsertByField(payload, 'reviews', 'seedKey', seedKey, {
      seedKey,
      name: review.name,
      rating: review.rating,
      text: review.text,
      date: new Date(review.date).toISOString(),
      service: serviceId,
      serviceLabel: review.service,
      approved: review.approved ?? false,
      featured: review.featured ?? false,
      order: review.order ?? index,
    })
  }

  console.log('→ Seeding FAQs...')
  for (const [index, item] of FAQ_ITEMS.entries()) {
    const seedKey = faqSeedKey(item.question)

    await upsertByField(payload, 'faqs', 'seedKey', seedKey, {
      seedKey,
      question: item.question,
      answer: item.answer,
      category: item.category ?? 'general',
      published: item.published ?? true,
      order: item.order ?? index,
    })
  }

  console.log('✓ Seed completed successfully.')
  process.exit(0)
}

seed().catch((error) => {
  console.error('✗ Seed failed:', error)
  process.exit(1)
})
