import legalPages from '../../../content/legal-pages.json'

type LegalSection = {
  title: string
  paragraphs: string[]
}

function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="prose max-w-none space-y-6 text-muted-foreground">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{section.title}</h2>
          <div className="space-y-3">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function DefaultLegalPrivacy() {
  return <LegalContent sections={legalPages.privacySections} />
}

export function DefaultLegalCookies() {
  return <LegalContent sections={legalPages.cookiesSections} />
}

export function DefaultLegalTerms() {
  return <LegalContent sections={legalPages.termsSections} />
}
