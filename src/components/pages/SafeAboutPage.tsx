'use client'

import { CheckCircle } from '@phosphor-icons/react'

import { RichTextContent } from '@/components/cms/RichTextContent'
import { Card, CardContent } from '@/components/ui/card'
import type { DesprePageView } from '@/lib/cms-types'

export function SafeAboutPage({ content }: { content: DesprePageView }) {
  return (
    <div className="py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">{content.pageTitle}</h1>
          <p className="mb-6 text-lg text-muted-foreground">{content.intro}</p>

          <div className="mx-auto my-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {content.stats.map((stat) => (
              <Card key={`${stat.value}-${stat.label}`} className="min-w-0">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 break-words text-2xl leading-tight font-bold text-accent sm:text-3xl">
                    {stat.value}
                  </div>
                  <p className="text-sm leading-snug text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="mb-4 text-2xl font-bold">{content.whyTitle}</h2>
            <ul className="mb-8 space-y-3">
              {content.whyItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={20} weight="fill" className="flex-shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="mb-4 text-2xl font-bold">{content.missionTitle}</h2>
            <p className="mb-6 text-muted-foreground">{content.missionText}</p>

            <h2 className="mb-4 text-2xl font-bold">{content.valuesTitle}</h2>
            {content.valuesContent ? (
              <RichTextContent
                data={content.valuesContent}
                className="prose max-w-none text-muted-foreground"
              />
            ) : (
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Calitate</strong> — alegem materialele și procesul potrivit pentru lucrarea
                  și bugetul agreat.
                </p>
                <p>
                  <strong>Transparență</strong> — explicăm operațiunile, costurile și dependențele
                  înainte de începerea lucrării.
                </p>
                <p>
                  <strong>Responsabilitate</strong> — condițiile garanției sunt menționate în
                  documentele aferente fiecărei lucrări.
                </p>
                <p>
                  <strong>Respect</strong> — tratăm fiecare client și fiecare vehicul cu atenție și
                  profesionalism.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
