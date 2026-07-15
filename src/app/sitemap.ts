import type { MetadataRoute } from 'next'

import { getBlogPosts, getPortfolioProjects } from '@/lib/queries'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { SITEMAP_STATIC_PATHS } from '@/lib/seo/static-pages'

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSeoSettings()
  const [blogPosts, portfolioProjects] = await Promise.all([
    getBlogPosts(200),
    getPortfolioProjects(200),
  ])

  const staticEntries: MetadataRoute.Sitemap = SITEMAP_STATIC_PATHS.map((path) => ({
    url: `${settings.siteUrl}${path}`,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${settings.siteUrl}/blog/${post.slug}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const portfolioEntries: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${settings.siteUrl}/portofoliu/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries, ...portfolioEntries]
}
