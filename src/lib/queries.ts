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
    depth: 0,
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
    depth: 0,
    ...PUBLIC_READ,
  })

  if (result.docs.length) return result.docs.map(mapService)
  return getServices(limit)
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
    sort: 'order',
    limit,
    depth: 1,
    ...PUBLIC_READ,
  })

  return result.docs.map(mapReview)
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
    getApprovedReviews(homepage.reviewsLimit ?? 3),
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
