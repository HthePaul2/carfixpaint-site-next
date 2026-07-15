'use client'

import * as Icons from '@phosphor-icons/react'
import { ArrowRight, CheckCircle, Clock, Phone } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type {
  HomepageView,
  PortfolioProjectView,
  ReviewView,
  ServiceView,
} from '@/lib/cms-types'

type HomePageProps = {
  homepage: HomepageView
  services: ServiceView[]
  portfolioProjects: PortfolioProjectView[]
  reviews: ReviewView[]
}

type IconComponent = React.ComponentType<{
  size?: number
  weight?: string
  className?: string
}>

function resolveIcon(iconName: string): IconComponent {
  return (Icons[iconName as keyof typeof Icons] as IconComponent | undefined) ?? CheckCircle
}

export function HomePage({ homepage, services, portfolioProjects, reviews }: HomePageProps) {
  const router = useRouter()
  const company = useSiteSettings()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(226,76,45,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.03)_75%)] bg-[length:20px_20px]" />

        <div className="container relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-accent text-accent-foreground">{homepage.heroBadge}</Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {homepage.heroTitle}
              <br />
              <span className="text-accent">{homepage.heroAccentText}</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed opacity-90 md:text-xl">
              {homepage.heroDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                <Button
                  size="lg"
                  className="w-full gap-2 text-lg shadow-lg transition-shadow hover:shadow-xl sm:w-auto"
                >
                  <Phone weight="bold" size={22} />
                  {homepage.heroCtaPhoneLabel}
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="w-full gap-2 border-white/20 bg-white/10 text-lg text-white hover:bg-white/20 sm:w-auto"
              >
                {homepage.heroCtaQuoteLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-secondary/30 py-12">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {homepage.benefits.map((benefit) => {
              const BenefitIcon = resolveIcon(benefit.icon)
              return (
                <motion.div key={benefit.title} variants={item}>
                  <Card className="h-full text-center transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <BenefitIcon size={48} weight="duotone" className="mx-auto mb-4 text-accent" />
                      <h2 className="mb-2 text-lg font-semibold">{benefit.title}</h2>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
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
              const ServiceIcon = resolveIcon(service.icon)
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <ServiceIcon size={40} weight="duotone" className="mb-4 text-accent" />
                      <h3 className="mb-3 text-xl font-semibold">{service.name}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>
                      <ul className="space-y-2">
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
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => router.push('/servicii')} className="gap-2">
              Vezi toate serviciile
              <ArrowRight weight="bold" size={20} />
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
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-4">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                        {index + 1}
                      </div>
                      <h3 className="mb-1 font-semibold">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < homepage.damageProcessSteps.length - 1 && (
                    <ArrowRight
                      size={24}
                      weight="bold"
                      className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-accent md:block"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => router.push('/daune')} className="gap-2">
                Vezi procesul pentru RCA/CASCO
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {portfolioProjects.length > 0 && (
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
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="cursor-pointer overflow-hidden transition-shadow hover:shadow-xl"
                    onClick={() => router.push(`/portofoliu/${project.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
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
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/portofoliu')}
                className="gap-2"
              >
                Vezi tot portofoliul
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
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
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4 flex gap-1">
                        {Array.from({ length: review.rating }, (_, index) => (
                          <span key={index} className="text-xl text-accent">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="mb-4 text-sm italic">&quot;{review.text}&quot;</p>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.service}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/recenzii')}
                className="gap-2"
              >
                Vezi toate recenziile
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-accent py-20 text-accent-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{homepage.finalCtaTitle}</h2>
            <p className="mb-8 text-lg opacity-90">{homepage.finalCtaDescription}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="secondary" className="w-full gap-2 text-lg sm:w-auto">
                  <Phone weight="bold" size={22} />
                  {company.phone}
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="w-full gap-2 border-white/20 bg-white/10 text-lg text-white hover:bg-white/20 sm:w-auto"
              >
                {homepage.finalCtaButtonLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-80">
              <Clock size={20} weight="bold" />
              <span>{company.schedule}</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
