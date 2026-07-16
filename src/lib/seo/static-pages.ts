export type StaticPageKey =
  | 'home'
  | 'servicii'
  | 'programare'
  | 'daune'
  | 'portofoliu'
  | 'despre'
  | 'recenzii'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'terms'

export type StaticPageSeo = {
  path: string
  title: string
  description: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
}

export const STATIC_PAGE_SEO: Record<StaticPageKey, StaticPageSeo> = {
  home: {
    path: '/',
    title:
      'Consiliere daune RCA Brașov | Constatare amiabilă și mașină la schimb | CarFix Paint',
    description:
      'Consiliere gratuită pentru constatarea amiabilă și deschiderea dosarului de daune în Brașov. Mașină la schimb pentru dosarele RCA. Tinichigerie, vopsitorie și service auto.',
    keywords:
      'consiliere daune RCA Brașov, constatare amiabilă, deschidere dosar daune, mașină la schimb RCA, service auto Brașov, tinichigerie Brașov',
    ogTitle: 'Consiliere gratuită daune + mașină la schimb RCA | CarFix Paint',
    ogDescription:
      'Te ghidăm la constatarea amiabilă și deschiderea dosarului. Pentru RCA, mașină la schimb pe durata reparației.',
  },
  servicii: {
    path: '/servicii',
    title: 'Servicii Auto Complete Brașov | Tinichigerie, Vopsitorie, Mecanică - CarFix Paint',
    description:
      'Servicii auto complete: tinichigerie profesională, vopsitorie cabină specializată, mecanică auto, diagnoză computerizată. Echipamente premium, garanție extinsă. Program Luni-Vineri 08:00-18:00.',
    keywords:
      'servicii auto Brașov, tinichigerie profesională, vopsitorie auto, mecanică auto, diagnoză computerizată, reparații caroserie, service multimarcă Brașov',
    ogTitle: 'Servicii Auto Complete - CarFix Paint Brașov',
    ogDescription:
      'Tinichigerie, vopsitorie cabină premium, mecanică generală, diagnoză cu echipamente profesionale. Garanție la toate lucrările.',
  },
  programare: {
    path: '/programare',
    title: 'Programare service auto Brașov | Car Fix & Paint',
    description:
      'Solicită online o programare pentru constatare, diagnoză sau evaluarea mașinii la Car Fix & Paint Brașov.',
    keywords: 'programare service auto Brașov, constatare auto, programare CarFix Paint',
    ogTitle: 'Programare online — CarFix Paint Brașov',
    ogDescription:
      'Alege serviciul și intervalul preferat. Confirmăm programarea telefonic sau pe email.',
  },
  daune: {
    path: '/daune',
    title: 'Consiliere daune RCA Brașov | Constatare amiabilă și mașină la schimb | CarFix Paint',
    description:
      'Consiliere gratuită pentru constatarea amiabilă și deschiderea dosarului de daune în Brașov. Mașină la schimb pentru dosarele RCA.',
    keywords:
      'consiliere daune RCA, constatare amiabilă Brașov, deschidere dosar daune, mașină la schimb RCA',
    ogTitle: 'Consiliere gratuită daune + mașină la schimb RCA',
    ogDescription:
      'Te ghidăm la constatarea amiabilă și deschiderea dosarului. Pentru RCA, mașină la schimb pe durata reparației.',
  },
  portofoliu: {
    path: '/portofoliu',
    title: 'Portofoliu Lucrări Auto Before/After | Proiecte Finalizate - CarFix Paint Brașov',
    description:
      'Galerie foto cu proiecte finalizate: reparații caroserie, vopsitorie profesională, daune complexe. Imagini before/after care demonstrează calitatea serviciilor noastre din Brașov.',
    keywords:
      'portofoliu service auto, lucrări tinichigerie before after, vopsitorie auto proiecte, reparații caroserie Brașov, transformări auto',
    ogTitle: 'Proiecte Finalizate - Lucrări Premium CarFix Paint',
    ogDescription:
      'Vezi transformările complete: de la daune majore la finish impecabil. Galerie foto before/after cu proiecte reale.',
  },
  despre: {
    path: '/despre',
    title: 'Despre CarFix Paint | Service Auto Premium cu Experiență în Brașov',
    description:
      'Service auto în Brașov. Echipă de specialiști, echipamente premium, standarde înalte de calitate. Aflați povestea noastră și valorile care ne ghidează.',
    keywords:
      'despre CarFix Paint, service auto Brașov experiență, echipă specialiști auto, cabină vopsitorie profesională, service auto de încredere',
    ogTitle: 'Despre Noi - CarFix Paint Brașov',
    ogDescription:
      'Reparații auto premium în Brașov. Echipă dedicată, echipamente profesionale, pasiune pentru mașini.',
  },
  recenzii: {
    path: '/recenzii',
    title: 'Recenzii Clienți CarFix Paint | Testimoniale Service Auto Brașov',
    description:
      'Citește recenziile clienților mulțumiți de serviciile CarFix Paint. Testimoniale reale despre tinichigerie, vopsitorie, gestionare daune și profesionalism.',
    keywords:
      'recenzii CarFix Paint, testimoniale service auto Brașov, păreri clienți, recenzii tinichigerie vopsitorie, rating service auto',
    ogTitle: 'Recenzii Clienți - CarFix Paint Brașov',
    ogDescription:
      'Citește experiențele reale cu serviciile noastre de tinichigerie, vopsitorie și gestionare daune.',
  },
  faq: {
    path: '/faq',
    title: 'Întrebări Frecvente (FAQ) | Service Auto CarFix Paint Brașov',
    description:
      'Răspunsuri la întrebările frecvente despre servicii auto, prețuri, durată reparații, proces daune RCA/CASCO, garanție și mașină la schimb. Tot ce trebuie să știi despre CarFix Paint.',
    keywords:
      'întrebări frecvente service auto, FAQ tinichigerie vopsitorie, întrebări daune RCA CASCO, prețuri service auto Brașov, garanție reparații auto',
    ogTitle: 'Întrebări Frecvente - CarFix Paint',
    ogDescription:
      'Găsește răspunsuri rapide la întrebările despre servicii, prețuri, proces daune, garanție și mai mult.',
  },
  blog: {
    path: '/blog',
    title: 'Blog Auto | Sfaturi, Ghiduri și Noutăți Automotive - CarFix Paint Brașov',
    description:
      'Articole utile despre întreținerea auto, sfaturi pentru șoferi, ghiduri pentru daune RCA/CASCO, noutăți din industria auto și tehnologii moderne în service-ul auto.',
    keywords:
      'blog auto, sfaturi întreținere auto, ghid daune RCA, articole automotive, tips auto, noutăți service auto Brașov',
    ogTitle: 'Blog Automotive - CarFix Paint',
    ogDescription:
      'Sfaturi practice, ghiduri detaliate și informații utile despre întreținerea mașinii tale și navigarea procesului de daune.',
  },
  contact: {
    path: '/contact',
    title: 'Contact CarFix Paint Brașov | Cere Ofertă Service Auto | 0760 686 384',
    description:
      'Contactează CarFix Paint Brașov: Calea Făgărașului nr. 8. Telefon: 0760 686 384, Email: office@carfixpaint.ro. Program: Luni-Vineri 08:00-18:00. Formular cerere ofertă online.',
    keywords:
      'contact CarFix Paint, service auto Brașov contact, cerere ofertă tinichigerie, telefon service auto, adresa CarFix Paint, program service auto',
    ogTitle: 'Contact & Locație - CarFix Paint Brașov',
    ogDescription:
      'Sună la 0760 686 384 sau trimite o cerere de ofertă online. Ne găsești pe Calea Făgărașului nr. 8, Brașov.',
  },
  privacy: {
    path: '/politica-confidentialitate',
    title: 'Politica de Confidențialitate | Protecția Datelor - CarFix Paint',
    description:
      'Politica de confidențialitate CarFix Paint: cum colectăm, folosim și protejăm datele personale conform GDPR. Informații despre cookies, drepturi utilizatori și securitate date.',
    keywords:
      'politica confidențialitate, protecția datelor personale, GDPR, prelucrare date, drepturi utilizatori',
  },
  cookies: {
    path: '/politica-cookies',
    title: 'Politica de Cookies | CarFix Paint Brașov',
    description:
      'Informații despre utilizarea cookies pe site-ul CarFix Paint: tipuri de cookies, scopul utilizării, gestionarea preferințelor și conformitate GDPR.',
    keywords: 'politica cookies, cookies site, gestionare cookies, preferințe cookies',
  },
  terms: {
    path: '/termeni-conditii',
    title: 'Termeni și Condiții | CarFix Paint Service Auto Brașov',
    description:
      'Termeni și condiții de utilizare a serviciilor CarFix Paint: conditii generale, responsabilități, garanții, politică de returnare și reglementări legale.',
    keywords:
      'termeni si conditii, conditii service auto, termeni utilizare, reglementari legale',
  },
}

export const SITEMAP_STATIC_PATHS = [
  '/',
  '/servicii',
  '/programare',
  '/daune',
  '/portofoliu',
  '/despre',
  '/recenzii',
  '/faq',
  '/blog',
  '/contact',
  '/politica-confidentialitate',
  '/politica-cookies',
  '/termeni-conditii',
] as const

export const DEFAULT_PAGE_SEO = STATIC_PAGE_SEO
