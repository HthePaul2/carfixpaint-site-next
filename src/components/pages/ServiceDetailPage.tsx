'use client'

import * as Icons from '@phosphor-icons/react'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import type { ServiceView } from '@/lib/cms-types'

type ServiceDetailPageProps = {
  service: ServiceView
}

type IconComponent = React.ComponentType<{
  size?: number
  weight?: string
  className?: string
}>

function resolveIcon(iconName: string): IconComponent {
  return (Icons[iconName as keyof typeof Icons] ?? CheckCircle) as IconComponent
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const router = useRouter()
  const ServiceIcon = resolveIcon(service.icon)

  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container">
          <nav className="mb-8 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Acasă
            </Link>
            <span className="mx-2">/</span>
            <Link href="/servicii" className="hover:text-white">
              Servicii
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.heroTitle}</span>
          </nav>

          <div className="max-w-3xl">
            <ServiceIcon size={56} weight="duotone" className="mb-6 text-accent" />
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{service.heroTitle}</h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">{service.heroSubtitle}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => router.push('/contact#evaluare')}
              >
                {service.ctaPrimaryLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.push(`/programare?service=${service.slug}`)}
              >
                {service.ctaSecondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-lg leading-relaxed text-muted-foreground">{service.intro}</p>
        </div>
      </section>

      {service.whenNeededItems.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <div className="container max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">{service.whenNeededTitle}</h2>
            <ul className="space-y-4">
              {service.whenNeededItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={22}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {service.features.length > 0 ? (
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">Ce include serviciul</h2>
            <ul className="space-y-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle
                    size={22}
                    weight="fill"
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {service.processSteps.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <div className="container max-w-3xl">
            <h2 className="mb-10 text-3xl font-bold">{service.processTitle}</h2>
            <ol className="space-y-8">
              {service.processSteps.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-lg bg-accent p-8 text-center text-accent-foreground md:p-10">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">{service.ctaTitle}</h2>
            <p className="mb-8 opacity-90">{service.ctaDescription}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={() => router.push('/contact#evaluare')}
              >
                {service.ctaPrimaryLabel}
                <ArrowRight weight="bold" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.push(`/programare?service=${service.slug}`)}
              >
                {service.ctaSecondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
