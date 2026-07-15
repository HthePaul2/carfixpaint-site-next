'use client'

import { CheckCircle } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import type { ServiciiPageView, ServiceView } from '@/lib/cms-types'
import * as Icons from '@phosphor-icons/react'
import { motion } from 'framer-motion'

type ServicesPageProps = {
  content: ServiciiPageView
  services: ServiceView[]
}

export function ServicesPage({ content, services }: ServicesPageProps) {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        {services.length === 0 ? (
          <EmptyState message="Nu există servicii active momentan." />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; weight?: string; className?: string }>
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <IconComponent size={56} weight="duotone" className="text-accent mb-4" />
                    <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
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
        )}
      </div>
    </div>
  )
}
