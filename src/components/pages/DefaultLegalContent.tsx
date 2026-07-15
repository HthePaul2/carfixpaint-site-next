'use client'

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'

export function DefaultLegalPrivacy() {
  const company = useSiteSettings()

  return (
    <div className="prose max-w-none space-y-6 text-muted-foreground">
      <p>
        CarFix Paint respectă confidențialitatea datelor dumneavoastră personale și se angajează să
        protejeze informațiile pe care le colectăm.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Ce date colectăm</h2>
      <p>
        Colectăm următoarele categorii de date personale: nume, prenume, adresă de email, număr de
        telefon, date despre vehicul (marcă, model, număr de înmatriculare).
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Cum folosim datele</h2>
      <p>
        Datele personale sunt utilizate pentru: comunicarea cu dumneavoastră, procesarea cererilor de
        service, gestionarea documentației pentru daune RCA/CASCO, îmbunătățirea serviciilor noastre.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Protecția datelor</h2>
      <p>
        Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră
        împotriva accesului neautorizat, pierderii sau distrugerii.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Drepturile dumneavoastră</h2>
      <p>
        Aveți dreptul de a accesa, rectifica, șterge sau restricționa prelucrarea datelor
        personale. Pentru exercitarea acestor drepturi, ne puteți contacta la {company.email}.
      </p>
    </div>
  )
}

export function DefaultLegalCookies() {
  return (
    <div className="prose max-w-none space-y-6 text-muted-foreground">
      <p>
        Acest website folosește cookies pentru a îmbunătăți experiența utilizatorilor și pentru a
        analiza traficul.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Ce sunt cookies</h2>
      <p>
        Cookies sunt fișiere text mici stocate pe dispozitivul dumneavoastră când vizitați un
        website.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Tipuri de cookies</h2>
      <p>
        Folosim cookies esențiale (necesare pentru funcționarea site-ului) și cookies analitice
        (pentru a înțelege cum folosiți site-ul).
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Gestionarea cookies</h2>
      <p>
        Puteți șterge sau bloca cookies din setările browser-ului dumneavoastră. Rețineți că
        dezactivarea cookies poate afecta funcționalitatea site-ului.
      </p>
    </div>
  )
}

export function DefaultLegalTerms() {
  const company = useSiteSettings()

  return (
    <div className="prose max-w-none space-y-6 text-muted-foreground">
      <p>
        Prin utilizarea serviciilor CarFix Paint, sunteți de acord cu următorii termeni și condiții.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Servicii oferite</h2>
      <p>
        CarFix Paint oferă servicii de tinichigerie, vopsitorie, mecanică auto, diagnoză
        computerizată și gestionare daune RCA/CASCO.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Garanție</h2>
      <p>
        Toate lucrările beneficiază de garanție de 1 an pentru tinichigerie și vopsitorie, respectiv
        6 luni pentru mecanică. Garanția acoperă defectele de execuție și materialele folosite.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Plăți și tarife</h2>
      <p>
        Tarifele sunt comunicate înainte de începerea lucrărilor. Pentru daune RCA/CASCO cu
        decontare directă, nu este necesar avans din partea clientului.
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Responsabilități</h2>
      <p>
        Clientul răspunde pentru exactitatea informațiilor furnizate. CarFix Paint nu își asumă
        responsabilitatea pentru întârzieri cauzate de terțe părți (asigurători, furnizori de
        piese).
      </p>

      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact</h2>
      <p>
        Pentru întrebări despre termeni și condiții, ne puteți contacta la {company.email} sau{' '}
        {company.phone}.
      </p>
    </div>
  )
}
