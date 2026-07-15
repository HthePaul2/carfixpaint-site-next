'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Shield, Phone, Car } from '@phosphor-icons/react'
import * as Icons from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import type {
  BlogPageView,
  BlogPostListView,
  DaunePageView,
  DesprePageView,
  FAQView,
  FaqPageView,
  LegalPagesView,
  PortfolioProjectView,
  PortofoliuPageView,
  RecenziiPageView,
  ReviewView,
} from '@/lib/cms-types'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { EmptyState } from '@/components/ui/empty-state'
import { RichTextContent } from '@/components/cms/RichTextContent'
import { DefaultLegalPrivacy, DefaultLegalCookies, DefaultLegalTerms } from '@/components/pages/DefaultLegalContent'

function resolveIcon(iconName: string) {
  return Icons[iconName as keyof typeof Icons] as React.ComponentType<{
    size?: number
    weight?: string
    className?: string
  }>
}

export function DaunePage({ content }: { content: DaunePageView }) {
  const router = useRouter()
  const company = useSiteSettings()

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {content.highlights.map((item, idx) => {
            const IconComponent = resolveIcon(item.icon)
            return (
              <Card key={idx}>
                <CardContent className="p-6 text-center">
                  <IconComponent size={48} weight="duotone" className="text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{content.processTitle}</h2>
          <div className="space-y-6">
            {content.processSteps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground font-bold text-xl flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center bg-accent text-accent-foreground rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">{content.ctaTitle}</h2>
          <p className="mb-6 opacity-90">{content.ctaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
              <Button size="lg" variant="secondary">
                <Phone weight="bold" size={20} className="mr-2" />
                {company.phone}
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              {content.ctaContactLabel}
              <ArrowRight weight="bold" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PortfolioPage({
  content,
  projects,
}: {
  content: PortofoliuPageView
  projects: PortfolioProjectView[]
}) {
  const router = useRouter()

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {projects.length === 0 ? (
          <EmptyState message="Nu există proiecte publicate momentan. Revino în curând." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/portofoliu/${project.slug}`)}
                >
                  <div className="grid md:grid-cols-2 gap-4 p-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Înainte</p>
                      <img
                        src={project.beforeImage}
                        alt="Before"
                        className="rounded-md w-full h-48 object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">După</p>
                      <img
                        src={project.afterImage}
                        alt="After"
                        className="rounded-md w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  <CardContent className="pt-0 px-6 pb-6">
                    <Badge className="mb-2">{project.duration}</Badge>
                    <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AboutPage({ content }: { content: DesprePageView }) {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.pageTitle}</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">{content.intro}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              {content.stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">{content.whyTitle}</h2>
            <ul className="space-y-3 mb-8">
              {content.whyItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle size={20} weight="fill" className="text-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">{content.missionTitle}</h2>
            <p className="text-muted-foreground mb-6">{content.missionText}</p>

            <h2 className="text-2xl font-bold mb-4">{content.valuesTitle}</h2>
            {content.valuesContent ? (
              <RichTextContent
                data={content.valuesContent}
                className="prose max-w-none text-muted-foreground"
              />
            ) : (
              <p className="text-muted-foreground">
                <strong>Calitate</strong> - Folosim doar materiale premium și tehnologii moderne.
                <br />
                <strong>Transparență</strong> - Comunicăm clar și onest în fiecare etapă.
                <br />
                <strong>Responsabilitate</strong> - Ne asumăm garanția pentru fiecare lucrare.
                <br />
                <strong>Respect</strong> - Tratăm fiecare client cu atenție și profesionalism.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReviewsPage({
  content,
  reviews,
}: {
  content: RecenziiPageView
  reviews: ReviewView[]
}) {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {reviews.length === 0 ? (
          <EmptyState message="Nu există recenzii publicate momentan." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-accent text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm mb-4 italic">&quot;{review.text}&quot;</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.service} • {review.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function FAQPage({ content, faqs }: { content: FaqPageView; faqs: FAQView[] }) {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {faqs.length === 0 ? (
          <EmptyState message="Nu există întrebări frecvente publicate momentan." />
        ) : (
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  )
}

export function BlogPage({ content, posts }: { content: BlogPageView; posts: BlogPostListView[] }) {
  const router = useRouter()

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {posts.length === 0 ? (
          <EmptyState message="Nu există articole publicate momentan. Revino în curând." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  {post.image ? (
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20" />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function PrivacyPage({ content }: { content: LegalPagesView }) {
  return (
    <div className="py-16">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{content.privacyTitle}</h1>
        {content.privacyContent ? (
          <RichTextContent
            data={content.privacyContent}
            className="prose max-w-none text-muted-foreground"
          />
        ) : (
          <DefaultLegalPrivacy />
        )}
      </div>
    </div>
  )
}

export function CookiesPage({ content }: { content: LegalPagesView }) {
  return (
    <div className="py-16">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{content.cookiesTitle}</h1>
        {content.cookiesContent ? (
          <RichTextContent
            data={content.cookiesContent}
            className="prose max-w-none text-muted-foreground"
          />
        ) : (
          <DefaultLegalCookies />
        )}
      </div>
    </div>
  )
}

export function TermsPage({ content }: { content: LegalPagesView }) {
  return (
    <div className="py-16">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{content.termsTitle}</h1>
        {content.termsContent ? (
          <RichTextContent
            data={content.termsContent}
            className="prose max-w-none text-muted-foreground"
          />
        ) : (
          <DefaultLegalTerms />
        )}
      </div>
    </div>
  )
}
