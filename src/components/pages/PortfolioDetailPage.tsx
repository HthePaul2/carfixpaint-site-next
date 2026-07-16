'use client'

import { ArrowLeft, Info, WhatsappLogo } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PortfolioProjectView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

type PortfolioDetailPageProps = {
  project: PortfolioProjectView
}

export function PortfolioDetailPage({ project }: PortfolioDetailPageProps) {
  const router = useRouter()
  const company = useSiteSettings()
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <div className="py-16">
      <div className="container max-w-6xl">
        <Button variant="ghost" onClick={() => router.push('/portofoliu')} className="mb-6">
          <ArrowLeft weight="bold" size={20} className="mr-2" />
          Înapoi la Portofoliu
        </Button>

        <div className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>{project.duration}</Badge>
            <Badge variant="secondary">Exemplu ilustrativ</Badge>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{project.title}</h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
        </div>

        <Card className="mb-8 border-accent/30 bg-accent/5">
          <CardContent className="flex gap-3 p-5 text-sm leading-relaxed">
            <Info size={22} weight="bold" className="mt-0.5 flex-shrink-0 text-accent" />
            <p>
              Imaginile sunt concepte vizuale generate pentru a ilustra tipul intervenției. Nu
              reprezintă fotografii ale unei lucrări executate de CarFix Paint și nu garantează un
              rezultat identic pentru o situație reală.
            </p>
          </CardContent>
        </Card>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <p className="text-sm font-semibold text-muted-foreground">
                  CONCEPT VIZUAL — ÎNAINTE
                </p>
              </div>
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={project.beforeImage}
                  alt={`${project.title} — concept vizual înainte`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <p className="text-sm font-semibold text-muted-foreground">
                  CONCEPT VIZUAL — DUPĂ
                </p>
              </div>
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={project.afterImage}
                  alt={`${project.title} — concept vizual după`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Servicii ilustrate în acest exemplu</h2>
            <div className="flex flex-wrap gap-2">
              {project.services.map((service) => (
                <Badge key={service} variant="secondary" className="px-4 py-2 text-base">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-accent p-8 text-center text-accent-foreground">
          <h3 className="mb-4 text-2xl font-bold">Ai o situație asemănătoare?</h3>
          <p className="mb-6 opacity-90">
            Trimite-ne detaliile mașinii sau programează o constatare. Soluția, costul și termenul se
            stabilesc după verificarea vehiculului.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Cere o evaluare
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
