import type { Metadata } from 'next'

import { BlogPage } from '@/components/pages/AllPages'
import { getBlogPosts, getStaticPages } from '@/lib/queries'
import { createStaticPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata('blog')
}

export default async function Page() {
  const [posts, staticPages] = await Promise.all([getBlogPosts(), getStaticPages()])
  return <BlogPage content={staticPages.blog} posts={posts} />
}
