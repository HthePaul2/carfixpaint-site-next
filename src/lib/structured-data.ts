import type { BlogPostDetailView, FAQView, ReviewView, ServiceView } from '@/lib/cms-types'
import { getSchemaPhone, type SiteSeoSettings } from '@/lib/seo/site-settings'

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[]

function absoluteUrl(settings: SiteSeoSettings, path: string): string {
  return `${settings.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildAutoRepairSchema(settings: SiteSeoSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${settings.siteUrl}/#business`,
    name: settings.siteName,
    url: settings.siteUrl,
    telephone: getSchemaPhone(settings),
    email: settings.email,
    image: settings.defaultOgImage,
    logo: absoluteUrl(settings, '/logo.svg'),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Brașov',
      addressRegion: 'BV',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.coordinates.lat,
      longitude: settings.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'Brașov',
    },
    serviceType: [
      'Tinichigerie auto',
      'Vopsitorie auto',
      'Mecanică auto',
      'Diagnoză computerizată',
      'Daune RCA/CASCO',
      'Decontare asigurări',
    ],
    paymentAccepted: 'Cash, Card, Transfer bancar',
    currenciesAccepted: 'RON',
  }
}

export function buildFaqPageSchema(faqs: FAQView[]) {
  if (!faqs.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildReviewsSchema(
  settings: SiteSeoSettings,
  reviews: ReviewView[],
  aggregate?: { averageRating: number; reviewCount: number },
) {
  if (!aggregate?.reviewCount && !reviews.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: settings.siteUrl,
    aggregateRating: aggregate?.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: aggregate.averageRating.toFixed(1),
          reviewCount: String(aggregate.reviewCount),
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
    review: reviews
      .filter((review) => review.hasComment)
      .map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.name,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(review.rating),
          bestRating: '5',
        },
        reviewBody: review.text,
        datePublished: review.date || undefined,
      })),
  }
}

export function buildServicesSchema(settings: SiteSeoSettings, services: ServiceView[]) {
  if (!services.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Service Auto Complet',
    provider: {
      '@type': 'AutoRepair',
      name: settings.siteName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Brașov',
        addressCountry: 'RO',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Brașov',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicii Auto',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
      })),
    },
  }
}

export function buildContactPageSchema(settings: SiteSeoSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absoluteUrl(settings, '/contact'),
    mainEntity: {
      '@type': 'AutoRepair',
      name: settings.siteName,
      telephone: getSchemaPhone(settings),
      email: settings.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Brașov',
        addressCountry: 'RO',
      },
    },
  }
}

export function buildAboutPageSchema(settings: SiteSeoSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: absoluteUrl(settings, '/despre'),
    mainEntity: {
      '@type': 'AutoRepair',
      name: settings.siteName,
      url: settings.siteUrl,
      description:
        'Service auto premium în Brașov — tinichigerie, vopsitorie, mecanică și gestionare daune RCA/CASCO.',
    },
  }
}

export function buildBreadcrumbSchema(
  settings: SiteSeoSettings,
  items: { name: string; path?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(settings, item.path) } : {}),
    })),
  }
}

export function buildBlogPostingSchema(
  settings: SiteSeoSettings,
  post: BlogPostDetailView,
) {
  const pageUrl = absoluteUrl(settings, `/blog/${post.slug}`)
  const image = post.ogImage ?? post.image ?? settings.defaultOgImage

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image,
    datePublished: post.publishedAt ?? post.date,
    dateModified: post.updatedAt ?? post.publishedAt ?? post.date,
    author: {
      '@type': 'Organization',
      name: settings.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(settings, '/logo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }
}

export function buildPortfolioProjectSchema(
  settings: SiteSeoSettings,
  project: {
    slug: string
    title: string
    description: string
    beforeImage: string
    afterImage: string
    seoDescription?: string
  },
) {
  const pageUrl = absoluteUrl(settings, `/portofoliu/${project.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: project.title,
    description: project.seoDescription ?? project.description,
    url: pageUrl,
    image: [project.beforeImage, project.afterImage],
    isPartOf: {
      '@type': 'WebSite',
      name: settings.siteName,
      url: settings.siteUrl,
    },
  }
}

export function buildServiceSchema(
  settings: SiteSeoSettings,
  service: {
    pageSlug: string
    name: string
    heroTitle: string
    intro: string
    seoDescription?: string
    description: string
  },
) {
  const pageUrl = absoluteUrl(settings, `/servicii/${service.pageSlug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.heroTitle || service.name,
    description: service.seoDescription ?? service.intro ?? service.description,
    url: pageUrl,
    provider: {
      '@type': 'AutoRepair',
      name: settings.siteName,
      telephone: getSchemaPhone(settings),
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Brașov',
        addressCountry: 'RO',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Brașov',
    },
  }
}

export function combineSchemas(...schemas: Array<JsonLdValue | null | undefined>): JsonLdValue {
  const filtered = schemas.filter(Boolean) as Record<string, unknown>[]

  if (filtered.length === 0) return {}
  if (filtered.length === 1) return filtered[0]
  return filtered
}
