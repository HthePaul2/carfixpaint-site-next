'use client'

import { Info } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import type { PortfolioProjectView, PortofoliuPageView } from '@/lib/cms-types'

export function IllustrativePortfolioPage({
  content,
  projects,
}: {
  content: PortofoliuPageView
  projects: PortfolioProjectView[]
}) {
  const router = useRouter()
  const subtitle =
    projects.length > 0
      ? 'Exemple vizuale care ilustrează tipuri de intervenții de tinichigerie, vopsitorie și reparații după daune.'
      : content.pageSubtitle

  return (
    <div className="py-16">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {projects.length > 0 ? (
          <div className="mx-auto mb-10 flex max-w-4xl gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed">
            <Info size={22} weight="bold" className="mt-0.5 flex-shrink-0 text-accent" />
            <p>
              Imaginile din această secțiune sunt concepte vizuale generate și au caracter
              ilustrativ. Nu reprezintă fotografii ale unor lucrări executate de CarFix Paint.
            </p>
          </div>
        ) : null}

        {projects.length === 0 ? (
          <EmptyState message="Nu există proiecte publicate momentan. Revino în curând." />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.slug}
              >
                <Card
                  className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                  onClick={() => router.push(`/portofoliu/${project.slug}`)}
                >
                  <div className="grid gap-4 p-6 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">Concept — înainte</p>
                      <img
                        src={project.beforeImage}
                        alt={`${project.title} — concept înainte`}
                        className="aspect-[3/4] w-full rounded-md bg-muted object-cover"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">Concept — după</p>
                      <img
                        src={project.afterImage}
                        alt={`${project.title} — concept după`}
                        className="aspect-[3/4] w-full rounded-md bg-muted object-cover"
                      />
                    </div>
                  </div>
                  <CardContent className="px-6 pt-0 pb-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge>{project.duration}</Badge>
                      <Badge variant="secondary">Imagine ilustrativă</Badge>
                    </div>
                    <h2 className="mb-3 text-xl font-semibold">{project.title}</h2>
                    <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
