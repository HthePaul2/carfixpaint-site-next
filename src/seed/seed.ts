import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { defaultHomepage, defaultSiteInfo, defaultStaticPages } from '@/lib/defaults'
import {
  BLOG_POSTS,
  COMPANY_INFO,
  FAQ_ITEMS,
  PORTFOLIO_PROJECTS,
  REVIEWS,
  SERVICES,
} from '@/seed/legacy-data'
import { faqSeedKey, reviewSeedKey, slugify } from '@/seed/slugify'
import { upsertByField, upsertBySlug, upsertGlobal } from '@/seed/upsert'

const SERVICE_LABEL_MAP: Record<string, string> = {
  tinichigerie: 'tinichigerie',
  vopsitorie: 'vopsitorie',
  mecanica: 'mecanica',
  'mecanică auto': 'mecanica',
  'daune rca': 'daune-rca-casco',
  'daune casco': 'daune-rca-casco',
  'daune rca/casco': 'daune-rca-casco',
}

function resolveServiceSlug(label: string): string | undefined {
  const normalized = label.trim().toLowerCase()

  if (SERVICE_LABEL_MAP[normalized]) {
    return SERVICE_LABEL_MAP[normalized]
  }

  if (normalized.includes('tinichigerie')) return 'tinichigerie'
  if (normalized.includes('vopsitor')) return 'vopsitorie'
  if (normalized.includes('mecanic')) return 'mecanica'
  if (normalized.includes('daune')) return 'daune-rca-casco'
  if (normalized.includes('diagnoz')) return 'diagnoza'
  if (normalized.includes('schimb')) return 'masina-schimb'

  return undefined
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  const serviceIdBySlug = new Map<string, number>()

  console.log('→ Seeding site-settings...')
  await upsertGlobal(payload, 'site-settings', {
    companyName: COMPANY_INFO.name,
    tagline: COMPANY_INFO.tagline,
    phone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: COMPANY_INFO.address,
    schedule: COMPANY_INFO.schedule,
    whatsappNumber: COMPANY_INFO.whatsappNumber,
    whatsappMessage: COMPANY_INFO.whatsappMessage,
    ctaPhoneLabel: 'Sună Acum',
    ctaQuoteLabel: 'Cere Ofertă Gratuită',
    logoAbbreviation: defaultSiteInfo.logoAbbreviation,
    footerDescription: defaultSiteInfo.footerDescription,
    footerServices: defaultSiteInfo.footerServices.map((label) => ({ label })),
    navigationItems: defaultSiteInfo.navigationItems,
    copyrightText: defaultSiteInfo.copyrightText,
  })

  console.log('→ Seeding homepage...')
  await upsertGlobal(payload, 'homepage', {
    heroBadge: defaultHomepage.heroBadge,
    heroTitle: defaultHomepage.heroTitle,
    heroAccentText: defaultHomepage.heroAccentText,
    heroDescription: defaultHomepage.heroDescription,
    heroCtaPhoneLabel: defaultHomepage.heroCtaPhoneLabel,
    heroCtaQuoteLabel: defaultHomepage.heroCtaQuoteLabel,
    benefits: defaultHomepage.benefits,
    servicesSectionTitle: defaultHomepage.servicesSectionTitle,
    servicesSectionSubtitle: defaultHomepage.servicesSectionSubtitle,
    portfolioSectionTitle: defaultHomepage.portfolioSectionTitle,
    reviewsSectionTitle: defaultHomepage.reviewsSectionTitle,
    servicesLimit: defaultHomepage.servicesLimit,
    portfolioLimit: defaultHomepage.portfolioLimit,
    reviewsLimit: defaultHomepage.reviewsLimit,
    damageProcessTitle: defaultHomepage.damageProcessTitle,
    damageProcessSteps: defaultHomepage.damageProcessSteps,
    finalCtaTitle: defaultHomepage.finalCtaTitle,
    finalCtaDescription: defaultHomepage.finalCtaDescription,
    finalCtaButtonLabel: defaultHomepage.finalCtaButtonLabel,
    seoTitle: defaultHomepage.seoTitle,
    seoDescription: defaultHomepage.seoDescription,
    seoKeywords: defaultHomepage.seoKeywords,
    ogTitle: defaultHomepage.ogTitle,
    ogDescription: defaultHomepage.ogDescription,
  })

  console.log('→ Seeding static pages...')
  await upsertGlobal(payload, 'static-pages', {
    servicii: defaultStaticPages.servicii,
    daune: {
      ...defaultStaticPages.daune,
      highlights: defaultStaticPages.daune.highlights,
      processSteps: defaultStaticPages.daune.processSteps,
    },
    portofoliu: defaultStaticPages.portofoliu,
    despre: {
      ...defaultStaticPages.despre,
      stats: defaultStaticPages.despre.stats,
      whyItems: defaultStaticPages.despre.whyItems.map((item) => ({ item })),
    },
    recenzii: defaultStaticPages.recenzii,
    faq: defaultStaticPages.faq,
    blog: defaultStaticPages.blog,
    contact: defaultStaticPages.contact,
  })

  console.log('→ Seeding services...')
  for (const [index, service] of SERVICES.entries()) {
    const doc = await upsertBySlug(payload, 'services', service.id, {
      name: service.name,
      icon: service.icon,
      description: service.description,
      shortDescription: service.description.slice(0, 180),
      features: service.features.map((feature) => ({ feature })),
      active: true,
      featured: index < 3,
      order: index,
    })

    serviceIdBySlug.set(service.id, doc.id as number)
  }

  console.log('→ Seeding portfolio projects...')
  for (const [index, project] of PORTFOLIO_PROJECTS.entries()) {
    const slug = slugify(project.title)
    const serviceIds = project.services
      .map((label) => resolveServiceSlug(label))
      .filter((value): value is string => Boolean(value))
      .map((serviceSlug) => serviceIdBySlug.get(serviceSlug))
      .filter((value): value is number => typeof value === 'number')

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
        featured: index < 3,
        order: index,
        publishedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
        _status: 'published',
      },
      { draft: false },
    )
  }

  console.log('→ Seeding blog posts...')
  for (const [index, post] of BLOG_POSTS.entries()) {
    const slug = slugify(post.title)

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
        category: 'general',
        featured: index === 0,
        publishedAt: new Date(post.date).toISOString(),
        _status: 'published',
      },
      { draft: false },
    )
  }

  console.log('→ Seeding reviews...')
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
      approved: true,
      featured: index < 3,
      order: index,
    })
  }

  console.log('→ Seeding FAQs...')
  for (const [index, item] of FAQ_ITEMS.entries()) {
    const seedKey = faqSeedKey(item.question)

    await upsertByField(payload, 'faqs', 'seedKey', seedKey, {
      seedKey,
      question: item.question,
      answer: item.answer,
      published: true,
      order: index,
    })
  }

  console.log('✓ Seed completed successfully.')
  process.exit(0)
}

seed().catch((error) => {
  console.error('✗ Seed failed:', error)
  process.exit(1)
})
