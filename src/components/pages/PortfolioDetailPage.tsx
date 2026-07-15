'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PortfolioProjectView } from '@/lib/cms-types'

type PortfolioDetailPageProps = {
  project: PortfolioProjectView
}

export function PortfolioDetailPage({ project }: PortfolioDetailPageProps) {
  const router = useRouter()

  return (
    <div className="py-16">
      <div className="container max-w-6xl">
        <Button variant="ghost" onClick={() => router.push('/portofoliu')} className="mb-6">
          <ArrowLeft weight="bold" size={20} className="mr-2" />
          Înapoi la Portofoliu
        </Button>

        <div className="mb-8">
          <Badge className="mb-4">{project.duration}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <p className="text-sm font-semibold text-muted-foreground">ÎNAINTE</p>
              </div>
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={project.beforeImage}
                  alt={`${project.title} — înainte de reparație`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <p className="text-sm font-semibold text-muted-foreground">DUPĂ</p>
              </div>
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={project.afterImage}
                  alt={`${project.title} — după reparație`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Servicii Efectuate</h2>
            <div className="flex flex-wrap gap-2">
              {project.services.map((service, idx) => (
                <Badge key={idx} variant="secondary" className="text-base px-4 py-2">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center bg-accent text-accent-foreground rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Vrei Rezultate Similare?</h3>
          <p className="mb-6 opacity-90">
            Contactează-ne pentru o evaluare gratuită și o ofertă personalizată.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="tel:0760686384">Sună Acum: 0760 686 384</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              Cere Ofertă
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
