'use client'

import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import type { ServiciiPageView, ServiceView } from '@/lib/cms-types'
import { resolvePhosphorIcon } from '@/lib/phosphor-icons'

type ServicesPageProps = {
  content: ServiciiPageView
  services: ServiceView[]
}

export function ServicesPage({ content, services }: ServicesPageProps) {
  const router = useRouter()

  return (
    <div className="py-16">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {services.length === 0 ? (
          <EmptyState message="Nu există servicii active momentan." />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((service) => {
              const IconComponent = resolvePhosphorIcon(service.icon)
              return (
                <div key={service.slug}>
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col p-8">
                      <IconComponent size={56} weight="duotone" className="mb-4 text-accent" />
                      <h2 className="mb-4 text-2xl font-bold">{service.name}</h2>
                      <p className="mb-6 text-muted-foreground">
                        {service.shortDescription ?? service.description}
                      </p>
                      <ul className="mb-8 flex-1 space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle
                              size={20}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-accent"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="gap-2 self-start"
                        onClick={() => router.push(`/servicii/${service.pageSlug}`)}
                      >
                        Vezi detalii
                        <ArrowRight weight="bold" size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
