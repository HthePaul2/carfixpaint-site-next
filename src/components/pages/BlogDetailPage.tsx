'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, WhatsappLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BlogPostBody } from '@/components/cms/BlogPostBody'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import type { BlogPostDetailView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

type BlogDetailPageProps = {
  post: BlogPostDetailView
  contentHtml?: string
}

export function BlogDetailPage({ post, contentHtml }: BlogDetailPageProps) {
  const router = useRouter()
  const company = useSiteSettings()
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <div className="py-16">
      <div className="container max-w-4xl">
        <Button variant="ghost" onClick={() => router.push('/blog')} className="mb-6">
          <ArrowLeft weight="bold" size={20} className="mr-2" />
          Înapoi la Blog
        </Button>

        <article>
          {post.image && (
            <div className="rounded-lg overflow-hidden mb-8">
              <img src={post.image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} citire</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              <BlogPostBody contentHtml={contentHtml} body={post.body} />
            </CardContent>
          </Card>

          <div className="mt-8 text-center bg-accent text-accent-foreground rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ai nevoie de ajutor?</h3>
            <p className="mb-6 opacity-90">
              Echipa CarFix Paint este gata să te ajute cu dauna sau cu o problemă la mașină.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo weight="fill" size={20} className="mr-2" />
                  Scrie-ne pe WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                Trimite o cerere
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
