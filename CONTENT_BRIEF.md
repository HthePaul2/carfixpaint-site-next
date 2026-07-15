# CarFix Paint — brief conținut & asset-uri

Document pentru generare texte reale și imagini (ex. ChatGPT, designer, copywriter).
Limba site-ului: **română**. Ton: profesional, direct, de încredere.

## Despre firmă (date reale de păstrat)

| Câmp | Valoare actuală |
|------|-----------------|
| Nume | CarFix Paint |
| Tagline | Service Auto Premium Brașov |
| Telefon | 0760 686 384 |
| Email | office@carfixpaint.ro |
| Adresă | Calea Făgărașului nr. 8, Brașov |
| Program | Luni–Vineri 08:00–18:00 |
| Servicii | Tinichigerie, vopsitorie, mecanică, diagnoză, daune RCA/CASCO, mașină la schimb |

## Ce e demo acum (de înlocuit)

- Imagini **Unsplash** în `src/seed/data.ts` (portofoliu, blog) — URL-uri externe, nu sunt ale firmei
- Texte seed/demo — pot fi îmbunătățite, dar structura CMS e deja legată
- `media/` local e gitignored — asset-urile uploadate în Payload nu intră în Git

## Unde se editează conținutul

### Admin Payload (`/admin`)

| Secțiune | Ce conține |
|----------|------------|
| **Setări site** | Firmă, social, meniu, footer, **imagine OG implicită** |
| **Pagina principală** | Hero, beneficii, titluri secțiuni, proces daune, CTA, **SEO + og:image** |
| **Pagini statice** | Copy + SEO + **og:image** per pagină (servicii, daune, despre, etc.) |
| **Pagini legale** | Rich text + SEO + **og:image** |
| **Services** | Servicii (nume, descriere, features, icon) |
| **Portfolio Projects** | Before/after, titlu, descriere, SEO |
| **Blog Posts** | Articole Lexical sau markdown legacy |
| **Reviews** | Recenzii clienți |
| **FAQs** | Întrebări frecvente |
| **Media** | Toate imaginile uploadate |

### Fișiere cod (pentru seed / import în masă)

- `src/seed/data.ts` — date demo importate cu `npm run seed`
- `src/lib/defaults.ts` — fallback-uri dacă lipsesc din DB

## Asset-uri media de generat

Pune fișierele generate în `content-assets/` (folder în repo), apoi le uploadezi în **Media** din admin sau le legăm în seed.

### Imagini obligatorii

| Asset | Dimensiune recomandată | Utilizare |
|-------|------------------------|-----------|
| `og-default.jpg` | 1200×630 | Share social (toate paginile fără imagine proprie) |
| `hero-home.jpg` | 1920×1080 | Opțional fundal / marketing |
| Logo / monogramă | SVG sau PNG transparent | Brand „CF” / CarFix Paint |

### Portofoliu (6 proiecte)

Pentru fiecare proiect: **before** + **after**, 4:3 sau 16:9, min. 1200px lățime.

1. Reparație aripă + vopsitorie Audi  
2. Daune RCA BMW — bară + far  
3. Tinichigerie Mercedes — ușă  
4. Vopsitorie completă VW  
5. Reparație hayon + senzori Toyota  
6. Daune CASCO Ford — multiple zone  

### Blog (6 articole)

Cover **1200×600** per articol, tematic auto/service Brașov.

### Opțional per pagină

Imagini OG dedicate (1200×630) pentru: servicii, daune, despre, contact.

## Texte de rescris / îmbunătățit

1. **Homepage** — hero, beneficii, CTA (global `homepage`)
2. **Pagini statice** — global `static-pages` (toate tab-urile)
3. **6 servicii** — colecția `services`
4. **6 proiecte portofoliu** — titluri + descrieri reale
5. **6 articole blog** — conținut util SEO (ghiduri daune, întreținere)
6. **Recenzii** — testimoniale credibile (nume, serviciu, text)
7. **FAQ** — 10–15 întrebări reale de la clienți
8. **Pagini legale** — GDPR, cookies, termeni (consultant juridic recomandat)

## Livrabil util pentru import

Poți livra:

```text
content-assets/
  og-default.jpg
  portfolio/
    proiect-1-before.jpg
    proiect-1-after.jpg
  blog/
    articol-1-cover.jpg
content/
  services.json
  portfolio.json
  blog-posts.json
  reviews.json
  faqs.json
  static-pages.json
```

Format JSON: câmpurile din Payload (vezi `src/payload-types.ts` și colecțiile din `src/collections/`).

## Comenzi după ce ai conținutul

```bash
npm run seed          # re-importă date din data.ts
npm run dev           # verifică site + /admin
```

## Repo

- Cod aplicație: acest repository
- **Nu** comite `.env.local`, `node_modules`, `media/`
- Migrări DB: `src/migrations/` — rulează `npm run migrate` în producție
