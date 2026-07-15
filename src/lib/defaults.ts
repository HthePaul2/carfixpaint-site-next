import type { HomepageView, LegalPagesView, SiteInfoView, StaticPagesView } from '@/lib/cms-types'
import { DEFAULT_PAGE_SEO } from '@/lib/seo/static-pages'

export const defaultSiteInfo: SiteInfoView = {
  name: 'CarFix Paint',
  tagline: 'Service Auto Premium Brașov',
  phone: '0760 686 384',
  email: 'office@carfixpaint.ro',
  address: 'Calea Făgărașului nr. 8, Brașov',
  schedule: 'Luni-Vineri 08:00-18:00',
  whatsappNumber: '40760686384',
  whatsappMessage: 'Bună ziua! Aș dori mai multe informații despre serviciile CarFix Paint.',
  logoAbbreviation: 'CF',
  footerDescription:
    'Service auto multimarcă în Brașov. Tinichigerie, vopsitorie profesională și gestionare daune RCA/CASCO.',
  footerServices: [
    'Tinichigerie & Caroserie',
    'Vopsitorie Auto',
    'Mecanică Auto',
    'Diagnoză Computerizată',
    'Daune RCA/CASCO',
    'Mașină la Schimb',
  ],
  navigationItems: [
    { path: '/', label: 'Acasă' },
    { path: '/servicii', label: 'Servicii' },
    { path: '/daune', label: 'Daune RCA/CASCO' },
    { path: '/portofoliu', label: 'Portofoliu' },
    { path: '/despre', label: 'Despre Noi' },
    { path: '/recenzii', label: 'Recenzii' },
    { path: '/faq', label: 'FAQ' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ],
  copyrightText: '© 2026 CarFix Paint. Toate drepturile rezervate.',
}

export const defaultHomepage: HomepageView = {
  heroBadge: 'Service Auto Premium Brașov',
  heroTitle: 'Reparații Auto Profesionale',
  heroAccentText: 'Cu Decontare Directă',
  heroDescription:
    'Tinichigerie, vopsitorie și service mecanic de încredere în Brașov. Gestionăm complet daune RCA/CASCO. Îți oferim mașină la schimb și calitate premium garantată.',
  heroCtaPhoneLabel: 'Sună Acum',
  heroCtaQuoteLabel: 'Cere Ofertă Gratuită',
  benefits: [
    { icon: 'Lightning', title: 'Rapid', description: 'Lucrări în 3-10 zile' },
    { icon: 'CheckCircle', title: 'Calitate Premium', description: 'Garanție 1 an' },
    { icon: 'Shield', title: 'Decontare Directă', description: 'Fără avans din partea ta' },
    { icon: 'Car', title: 'Mașină la Schimb', description: 'Mobilitate constantă' },
  ],
  servicesSectionTitle: 'Serviciile Noastre',
  servicesSectionSubtitle:
    'Service auto multimarcă cu echipamente profesionale și experiență de peste 15 ani',
  portfolioSectionTitle: 'Lucrări Recente',
  reviewsSectionTitle: 'Ce Spun Clienții Noștri',
  servicesLimit: 6,
  portfolioLimit: 3,
  reviewsLimit: 3,
  damageProcessTitle: 'Ai Fost în Accident?',
  damageProcessSteps: [
    { title: 'Constatare', description: 'Vino la service pentru evaluare' },
    { title: 'Documentație', description: 'Întocmim dosarul complet' },
    { title: 'Aprobare', description: 'Trimitem la asigurare' },
    { title: 'Reparație', description: 'Începem lucrările' },
    { title: 'Finalizare', description: 'Ridici mașina reparată' },
  ],
  finalCtaTitle: 'Ai Nevoie de Reparație Auto în Brașov?',
  finalCtaDescription:
    'Sună acum pentru o evaluare gratuită sau trimite-ne detaliile și te contactăm noi în maxim 2 ore.',
  finalCtaButtonLabel: 'Completează Formular',
  seoTitle: DEFAULT_PAGE_SEO.home.title,
  seoDescription: DEFAULT_PAGE_SEO.home.description,
  seoKeywords: DEFAULT_PAGE_SEO.home.keywords,
  ogTitle: DEFAULT_PAGE_SEO.home.ogTitle,
  ogDescription: DEFAULT_PAGE_SEO.home.ogDescription,
}

export const defaultStaticPages: StaticPagesView = {
  servicii: {
    pageTitle: 'Serviciile Noastre',
    pageSubtitle:
      'Service auto complet multimarcă în Brașov. Echipamente profesionale, experiență de peste 15 ani și garanție pentru toate lucrările.',
    seoTitle: DEFAULT_PAGE_SEO.servicii.title,
    seoDescription: DEFAULT_PAGE_SEO.servicii.description,
    seoKeywords: DEFAULT_PAGE_SEO.servicii.keywords,
    ogTitle: DEFAULT_PAGE_SEO.servicii.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.servicii.ogDescription,
  },
  daune: {
    pageTitle: 'Gestionare Daune RCA/CASCO',
    pageSubtitle:
      'Te ajutăm cu tot procesul - de la constatare până la predarea mașinii reparate. Fără stres, fără birocrație.',
    highlights: [
      {
        icon: 'Shield',
        title: 'Decontare Directă',
        description: 'Nu plătești nimic în avans. Noi ne înțelegem direct cu asiguratorul.',
      },
      {
        icon: 'Car',
        title: 'Mașină la Schimb',
        description: 'Îți oferim un vehicul de înlocuire pe perioada reparației.',
      },
      {
        icon: 'CheckCircle',
        title: 'Toate Asigurările',
        description: 'Lucrăm cu toate companiile de asigurări din România.',
      },
    ],
    processTitle: 'Procesul Pas cu Pas',
    processSteps: [
      {
        title: 'Constatare Daună',
        description:
          'Aduci mașina la service-ul nostru pentru o evaluare completă a daunelor. Realizăm raport foto detaliat.',
      },
      {
        title: 'Întocmire Documentație',
        description:
          'Pregătim dosarul complet pentru asigurare: deviz detaliat, fotografii, formulare necesare.',
      },
      {
        title: 'Trimitere la Asigurare',
        description: 'Transmitem dosarul către compania de asigurări și urmărim aprobarea.',
      },
      {
        title: 'Începere Reparații',
        description:
          'După aprobare, începem lucrările. Îți oferim mașină la schimb și te ținem la curent zilnic.',
      },
      {
        title: 'Predare Vehicul',
        description:
          'La final, ridici mașina reparată complet, fără să plătești nimic (decontare directă).',
      },
    ],
    ctaTitle: 'Ai Fost în Accident?',
    ctaDescription: 'Sună acum pentru constatare gratuită și consiliere profesională.',
    ctaContactLabel: 'Trimite Cerere',
    seoTitle: DEFAULT_PAGE_SEO.daune.title,
    seoDescription: DEFAULT_PAGE_SEO.daune.description,
    seoKeywords: DEFAULT_PAGE_SEO.daune.keywords,
    ogTitle: DEFAULT_PAGE_SEO.daune.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.daune.ogDescription,
  },
  portofoliu: {
    pageTitle: 'Portofoliu Lucrări',
    pageSubtitle: 'Proiecte finalizate cu rezultate impecabile. Calitate premium garantată.',
    seoTitle: DEFAULT_PAGE_SEO.portofoliu.title,
    seoDescription: DEFAULT_PAGE_SEO.portofoliu.description,
    seoKeywords: DEFAULT_PAGE_SEO.portofoliu.keywords,
    ogTitle: DEFAULT_PAGE_SEO.portofoliu.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.portofoliu.ogDescription,
  },
  despre: {
    pageTitle: 'Despre CarFix Paint',
    intro:
      'CarFix Paint este un service auto premium din Brașov, specializat în tinichigerie, vopsitorie profesională și gestionare daune RCA/CASCO. Cu peste 15 ani de experiență în domeniu, ne-am construit reputația pe baza calității lucrărilor și transparenței în relația cu clienții.',
    stats: [
      { value: '15+', label: 'Ani de experiență' },
      { value: '500+', label: 'Clienți mulțumiți' },
      { value: '100%', label: 'Garanție lucrări' },
    ],
    whyTitle: 'De Ce CarFix Paint?',
    whyItems: [
      'Echipamente profesionale de ultimă generație',
      'Echipă calificată și certificată',
      'Cabină de vopsit modernă cu sistem de filtrare',
      'Bancă de trasare pentru caroserie',
      'Parteneriate cu toate asigurările',
      'Piese originale sau echivalente premium',
      'Garanție 1 an pentru toate lucrările',
      'Prețuri corecte și transparente',
    ],
    missionTitle: 'Misiunea Noastră',
    missionText:
      'Ne propunem să oferim servicii auto de cea mai înaltă calitate, cu transparență totală și respect față de client. Fiecare mașină care intră în service-ul nostru este tratată cu profesionalism maxim, iar satisfacția clientului este prioritatea noastră numărul unu.',
    valuesTitle: 'Valori',
    valuesContent: null,
    seoTitle: DEFAULT_PAGE_SEO.despre.title,
    seoDescription: DEFAULT_PAGE_SEO.despre.description,
    seoKeywords: DEFAULT_PAGE_SEO.despre.keywords,
    ogTitle: DEFAULT_PAGE_SEO.despre.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.despre.ogDescription,
  },
  recenzii: {
    pageTitle: 'Recenzii Clienți',
    pageSubtitle: 'Peste 500 de clienți mulțumiți ne-au acordat încrederea lor',
    seoTitle: DEFAULT_PAGE_SEO.recenzii.title,
    seoDescription: DEFAULT_PAGE_SEO.recenzii.description,
    seoKeywords: DEFAULT_PAGE_SEO.recenzii.keywords,
    ogTitle: DEFAULT_PAGE_SEO.recenzii.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.recenzii.ogDescription,
  },
  faq: {
    pageTitle: 'Întrebări Frecvente',
    pageSubtitle: 'Răspunsuri la cele mai comune întrebări despre serviciile noastre',
    seoTitle: DEFAULT_PAGE_SEO.faq.title,
    seoDescription: DEFAULT_PAGE_SEO.faq.description,
    seoKeywords: DEFAULT_PAGE_SEO.faq.keywords,
    ogTitle: DEFAULT_PAGE_SEO.faq.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.faq.ogDescription,
  },
  blog: {
    pageTitle: 'Blog & Noutăți',
    pageSubtitle: 'Sfaturi utile, ghiduri și ultimele noutăți din lumea auto',
    seoTitle: DEFAULT_PAGE_SEO.blog.title,
    seoDescription: DEFAULT_PAGE_SEO.blog.description,
    seoKeywords: DEFAULT_PAGE_SEO.blog.keywords,
    ogTitle: DEFAULT_PAGE_SEO.blog.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.blog.ogDescription,
  },
  contact: {
    pageTitle: 'Contact',
    pageSubtitle: 'Trimite-ne o cerere și te contactăm noi în maxim 2 ore',
    contactCardTitle: 'Date de Contact',
    fastResponseTitle: 'Răspuns Rapid Garantat',
  fastResponseText:
    'Te contactăm în maxim 2 ore în zilele lucrătoare. Pentru urgențe, sună direct la {phone}.',
    seoTitle: DEFAULT_PAGE_SEO.contact.title,
    seoDescription: DEFAULT_PAGE_SEO.contact.description,
    seoKeywords: DEFAULT_PAGE_SEO.contact.keywords,
    ogTitle: DEFAULT_PAGE_SEO.contact.ogTitle,
    ogDescription: DEFAULT_PAGE_SEO.contact.ogDescription,
  },
}

export const defaultLegalPages: LegalPagesView = {
  privacyTitle: 'Politică de Confidențialitate',
  privacyContent: null,
  privacySeoTitle: DEFAULT_PAGE_SEO.privacy.title,
  privacySeoDescription: DEFAULT_PAGE_SEO.privacy.description,
  privacySeoKeywords: DEFAULT_PAGE_SEO.privacy.keywords,
  cookiesTitle: 'Politică Cookies',
  cookiesContent: null,
  cookiesSeoTitle: DEFAULT_PAGE_SEO.cookies.title,
  cookiesSeoDescription: DEFAULT_PAGE_SEO.cookies.description,
  cookiesSeoKeywords: DEFAULT_PAGE_SEO.cookies.keywords,
  termsTitle: 'Termeni și Condiții',
  termsContent: null,
  termsSeoTitle: DEFAULT_PAGE_SEO.terms.title,
  termsSeoDescription: DEFAULT_PAGE_SEO.terms.description,
  termsSeoKeywords: DEFAULT_PAGE_SEO.terms.keywords,
}
