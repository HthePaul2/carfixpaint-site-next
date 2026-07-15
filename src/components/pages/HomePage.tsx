'use client'

import { useRouter } from 'next/navigation'
import { Phone, ArrowRight, CheckCircle, Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import type {
  HomepageView,
  PortfolioProjectView,
  ReviewView,
  ServiceView,
} from '@/lib/cms-types'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'

type HomePageProps = {
  homepage: HomepageView
  services: ServiceView[]
  portfolioProjects: PortfolioProjectView[]
  reviews: ReviewView[]
}

export function HomePage({ homepage, services, portfolioProjects, reviews }: HomePageProps) {
  const router = useRouter()
  const company = useSiteSettings()
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(226,76,45,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.03)_75%)] bg-[length:20px_20px]" />
        
        <div className="container relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-accent text-accent-foreground">
              {homepage.heroBadge}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {homepage.heroTitle}
              <br />
              <span className="text-accent">{homepage.heroAccentText}</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              {homepage.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                <Button size="lg" className="w-full sm:w-auto text-lg gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Phone weight="bold" size={22} />
                  {homepage.heroCtaPhoneLabel}
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="w-full sm:w-auto text-lg gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                {homepage.heroCtaQuoteLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-secondary/30">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {homepage.benefits.map((benefit, idx) => {
              const IconComponent = Icons[benefit.icon as keyof typeof Icons] as React.ComponentType<{
                size?: number
                weight?: string
                className?: string
              }>
              return (
              <motion.div key={idx} variants={item}>
                <Card className="text-center h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <IconComponent size={48} weight="duotone" className="mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{homepage.servicesSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">
              {homepage.servicesSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service) => {
              const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; weight?: string; className?: string }>
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <IconComponent size={40} weight="duotone" className="text-accent mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle size={18} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
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
              Vezi Toate Serviciile
              <ArrowRight weight="bold" size={20} />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{homepage.damageProcessTitle}</h2>
            <p className="text-lg text-muted-foreground">
              Te ajutăm cu tot procesul de la constatare până la reparație finală
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[
                { step: '1', title: 'Constatare', desc: 'Vino la service pentru evaluare' },
                { step: '2', title: 'Documentație', desc: 'Întocmim dosarul complet' },
                { step: '3', title: 'Aprobare', desc: 'Trimitem la asigurare' },
                { step: '4', title: 'Reparație', desc: 'Începem lucrările' },
                { step: '5', title: 'Finalizare', desc: 'Ridici mașina reparată' }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground font-bold text-xl flex items-center justify-center mx-auto mb-3">
                        {step.step}
                      </div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {idx < 4 && (
                    <ArrowRight
                      size={24}
                      weight="bold"
                      className="hidden md:block absolute top-1/2 -right-5 -translate-y-1/2 text-accent"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => router.push('/daune')} className="gap-2">
                Detalii Proces RCA/CASCO
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{homepage.portfolioSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">
              Portofoliu cu proiecte finalizate - rezultate impecabile garantate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/portofoliu/${project.slug}`)}
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={project.afterImage}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-accent">
                      {project.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
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
            <Button size="lg" variant="outline" onClick={() => router.push('/portofoliu')} className="gap-2">
              Vezi Tot Portofoliul
              <ArrowRight weight="bold" size={20} />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{homepage.reviewsSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">
              Peste 500 de clienți mulțumiți în ultimii 3 ani
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-accent text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-sm mb-4 italic">"{review.text}"</p>
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
            <Button size="lg" variant="outline" onClick={() => router.push('/recenzii')} className="gap-2">
              Toate Recenziile
              <ArrowRight weight="bold" size={20} />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {homepage.finalCtaTitle}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {homepage.finalCtaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg gap-2">
                  <Phone weight="bold" size={22} />
                  {company.phone}
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="w-full sm:w-auto text-lg gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                {homepage.finalCtaButtonLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-80">
              <Clock size={20} weight="bold" />
              <span>{company.schedule} • Răspuns rapid garantat</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
