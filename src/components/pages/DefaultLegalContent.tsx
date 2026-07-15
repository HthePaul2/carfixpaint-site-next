import legalPages from '../../../content/legal-pages.json'

type LegalSection = {
  title: string
  paragraphs: string[]
}

const paragraphReplacements = new Map<string, string>([
  [
    'Site-ul și serviciile prezentate sub brandul CarFix Paint sunt operate de entitatea juridică ce administrează service-ul. Denumirea legală, codul unic de identificare, numărul de înregistrare și sediul social trebuie completate și verificate înainte de publicarea acestei politici.',
    'Site-ul carfixpaint.ro și serviciile prezentate sub brandul CarFix Paint sunt operate de CAR FIX & PAINT SRL, CUI 32684306, cu sediul în Brașov, Calea Făgărașului nr. 8.',
  ],
  [
    'Perioadele exacte trebuie stabilite în procedura internă a operatorului și corelate cu sistemele folosite.',
    'Datele sunt păstrate numai atât timp cât este necesar pentru scopul în care au fost colectate și pentru îndeplinirea obligațiilor legale aplicabile.',
  ],
  [
    'Politica poate fi actualizată atunci când se schimbă serviciile, furnizorii sau cerințele legale. Data ultimei actualizări trebuie afișată pe pagină.',
    'Politica poate fi actualizată atunci când se schimbă serviciile, furnizorii sau cerințele legale. Ultima actualizare: 15 iulie 2026.',
  ],
  [
    'Lista concretă a serviciilor și duratele cookie-urilor trebuie completate după alegerea instrumentelor folosite în producție.',
    'Orice serviciu terț adăugat ulterior va fi documentat în această politică, împreună cu scopul și durata cookie-urilor folosite.',
  ],
  [
    'Denumirea legală, CUI-ul, numărul de înregistrare și sediul operatorului trebuie completate înainte de publicarea versiunii finale a acestor termeni.',
    'Operatorul site-ului este CAR FIX & PAINT SRL, CUI 32684306, cu sediul în Brașov, Calea Făgărașului nr. 8.',
  ],
])

function normalizeParagraph(paragraph: string): string {
  return paragraphReplacements.get(paragraph) ?? paragraph
}

function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="prose max-w-none space-y-6 text-muted-foreground">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-foreground">{section.title}</h2>
          <div className="space-y-3">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{normalizeParagraph(paragraph)}</p>
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
