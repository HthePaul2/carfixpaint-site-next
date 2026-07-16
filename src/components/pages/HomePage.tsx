import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, WhatsappLogo } from '@phosphor-icons/react/ssr'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type {
  HomepageView,
  PortfolioProjectView,
  ReviewView,
  ServiceView,
  SiteInfoView,
} from '@/lib/cms-types'
import { resolvePhosphorIcon } from '@/lib/phosphor-icons'
import { buildWhatsAppLink } from '@/lib/whatsapp'

type HomePageProps = {
  homepage: HomepageView
  services: ServiceView[]
  portfolioProjects: PortfolioProjectView[]
  reviews: ReviewView[]
  company: SiteInfoView
}

export function HomePage({
  homepage,
  services,
  portfolioProjects,
  reviews,
  company,
}: HomePageProps) {
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden bg-primary text-primary-foreground md:min-h-[78vh]">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/hero-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 768px)"
            srcSet="/hero-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/hero.avif" type="image/avif" />
          <img
            src="/hero.webp"
            alt="Service auto CarFix Paint în Brașov"
            width={1916}
            height={821}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="container relative flex min-h-[70vh] items-center py-20 md:min-h-[78vh] md:py-28">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-accent text-accent-foreground">{homepage.heroBadge}</Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {homepage.heroTitle}
              <br />
              <span className="text-accent">{homepage.heroAccentText}</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
              {homepage.heroDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full gap-2 text-lg shadow-lg sm:w-auto">
                <Link href="/contact#evaluare">
                  {homepage.heroCtaQuoteLabel}
                  <ArrowRight weight="bold" size={20} />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full border-white/20 bg-white/10 text-lg text-white hover:bg-white/20 sm:w-auto"
              >
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <WhatsappLogo weight="fill" size={20} />
                  {homepage.heroCtaPhoneLabel}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {homepage.benefits.map((benefit) => {
              const BenefitIcon = resolvePhosphorIcon(benefit.icon)
              return (
                <div key={benefit.title}>
                  <Card className="h-full text-center transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <BenefitIcon size={48} weight="duotone" className="mx-auto mb-4 text-accent" />
                      <h2 className="mb-2 text-lg font-semibold">{benefit.title}</h2>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{homepage.servicesSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">{homepage.servicesSectionSubtitle}</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const ServiceIcon = resolvePhosphorIcon(service.icon)
              return (
                <div key={service.slug} className="transition-transform hover:-translate-y-1">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="flex h-full flex-col p-6">
                      <ServiceIcon size={40} weight="duotone" className="mb-4 text-accent" />
                      <h3 className="mb-3 text-xl font-semibold">{service.name}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {service.shortDescription ?? service.description}
                      </p>
                      <ul className="mb-6 space-y-2">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <CheckCircle
                              size={18}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-accent"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" asChild className="mt-auto gap-2 self-start">
                        <Link href={`/servicii/${service.pageSlug}`}>
                          Vezi detalii
                          <ArrowRight weight="bold" size={16} />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/servicii">
                Vezi toate serviciile
                <ArrowRight weight="bold" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{homepage.damageProcessTitle}</h2>
            <p className="text-lg text-muted-foreground">
              Fiecare etapă este clarificată înainte să trecem la următoarea.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
              {homepage.damageProcessSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <Card className="h-full text-center">
                    <CardContent className="p-4">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                        {index + 1}
                      </div>
                      <h3 className="mb-1 font-semibold">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < homepage.damageProcessSteps.length - 1 ? (
                    <ArrowRight
                      size={24}
                      weight="bold"
                      className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-accent md:block"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/daune">
                  Vezi procesul pentru RCA/CASCO
                  <ArrowRight weight="bold" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {portfolioProjects.length > 0 ? (
        <section className="py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {homepage.portfolioSectionTitle}
              </h2>
              <p className="text-lg text-muted-foreground">
                Lucrări documentate cu detalii despre intervențiile realizate.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolioProjects.map((project) => (
                <div key={project.slug} className="transition-transform hover:scale-[1.02]">
                  <Link href={`/portofoliu/${project.slug}`} className="block">
                    <Card className="overflow-hidden transition-shadow hover:shadow-xl">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.afterImage}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <Badge className="absolute right-3 top-3 bg-accent">{project.duration}</Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/portofoliu">
                  Vezi tot portofoliul
                  <ArrowRight weight="bold" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {reviews.length > 0 ? (
        <section className="bg-secondary/30 py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{homepage.reviewsSectionTitle}</h2>
              <p className="text-lg text-muted-foreground">
                Recenzii reale, aprobate pentru publicare.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4 flex gap-1" aria-label={`${review.rating} din 5 stele`}>
                        {Array.from({ length: review.rating }, (_, index) => (
                          <span key={index} className="text-xl text-accent">
                            ★
                          </span>
                        ))}
                      </div>
                      {review.hasComment ? (
                        <p className="mb-4 text-sm leading-relaxed">{review.text}</p>
                      ) : (
                        <p className="mb-4 text-sm text-muted-foreground">
                          Evaluare de {review.rating}{' '}
                          {review.rating === 1 ? 'stea' : 'stele'} fără comentariu public.
                        </p>
                      )}
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.service}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/recenzii">
                  Vezi toate recenziile
                  <ArrowRight weight="bold" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-accent py-20 text-accent-foreground">
        <div className="container text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{homepage.finalCtaTitle}</h2>
            <p className="mb-8 text-lg text-accent-foreground">{homepage.finalCtaDescription}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="w-full gap-2 text-lg sm:w-auto">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo weight="fill" size={22} />
                  Scrie-ne pe WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full gap-2 border-white/30 bg-transparent text-lg text-accent-foreground hover:bg-white/15 sm:w-auto"
              >
                <Link href="/contact#evaluare">
                  {homepage.finalCtaButtonLabel}
                  <ArrowRight weight="bold" size={20} />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-accent-foreground">
              <Clock size={20} weight="bold" />
              <span>{company.schedule}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
