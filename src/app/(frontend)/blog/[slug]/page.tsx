import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'

import { BlogDetailPage } from '@/components/pages/BlogDetailPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { renderLegacyMarkdown } from '@/lib/content'
import { getBlogPostByLegacyId, getBlogPostBySlug } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteSeoSettings } from '@/lib/seo/site-settings'
import { STATIC_PAGE_SEO } from '@/lib/seo/static-pages'
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  combineSchemas,
} from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: { absolute: STATIC_PAGE_SEO.blog.title },
      description: STATIC_PAGE_SEO.blog.description,
    }
  }

  const settings = await getSiteSeoSettings()

  return buildPageMetadata(
    {
      title: post.seoTitle ?? `${post.title} - CarFix Paint Brașov`,
      description: post.seoDescription ?? post.excerpt,
      path: `/blog/${post.slug}`,
      keywords: STATIC_PAGE_SEO.blog.keywords,
      ogImage: post.ogImage ?? post.image,
      ogType: 'article',
    },
    settings,
  )
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  let post = await getBlogPostBySlug(slug)

  if (!post && /^\d+$/.test(slug)) {
    const legacyPost = await getBlogPostByLegacyId(slug)
    if (legacyPost) {
      if (legacyPost.slug !== slug) {
        redirect(`/blog/${legacyPost.slug}`)
      }
      post = legacyPost
    }
  }

  if (!post) {
    notFound()
  }

  const [settings, contentHtml] = await Promise.all([
    getSiteSeoSettings(),
    Promise.resolve(post.legacyMarkdown ? renderLegacyMarkdown(post.legacyMarkdown) : undefined),
  ])

  const schema = combineSchemas(
    buildBreadcrumbSchema(settings, [
      { name: 'Acasă', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title },
    ]),
    buildBlogPostingSchema(settings, post),
  )

  return (
    <>
      <JsonLd data={schema} />
      <BlogDetailPage post={post} contentHtml={contentHtml} />
    </>
  )
}
