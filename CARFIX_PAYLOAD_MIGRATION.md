# CarFix Paint — Migrare Vite + React la Next.js + Payload CMS

> Document de execuție pentru Cursor / agent AI
>
> Repo sursă: `HthePaul2/carfix-paint-premium`
>
> Repo de referință pentru integrarea Payload: `HthePaul2/flower-power-frontend`
>
> Obiectiv: o singură aplicație Next.js care conține atât site-ul public, cât și Payload CMS, fără backend separat.

---

## 0. Instrucțiuni pentru Cursor

Citește întregul document înainte să modifici proiectul.

Implementează migrarea autonom, etapizat, fără să schimbi designul vizual și fără să elimini funcționalități existente. Nu crea un backend Express, Laravel sau alt serviciu separat. Backendul, CMS-ul, autentificarea, API-ul și formularele trebuie să fie gestionate în aceeași aplicație Next.js prin Payload CMS.

### Reguli obligatorii

1. Păstrează aspectul actual al site-ului cât mai fidel posibil:
   - aceleași culori;
   - aceeași tipografie;
   - aceleași componente și animații;
   - același responsive behavior;
   - aceleași URL-uri publice.
2. Nu transforma site-ul într-un SPA Next.js complet client-side.
3. Conținutul important pentru SEO trebuie încărcat server-side prin Payload Local API.
4. Nu păstra conținutul CMS sau cererile de contact în `localStorage`.
5. Ruta `/admin` trebuie să devină exclusiv panoul Payload CMS.
6. Nu copia din Flower Power:
   - cheia Payload hardcodată;
   - SQLite-ul pentru producție;
   - versiuni incompatibile de Next.js;
   - configurări specifice domeniului Flower Power.
7. Toate pachetele `payload` și `@payloadcms/*` trebuie să folosească aceeași versiune compatibilă.
8. Folosește minimum Next.js `16.2.6` și Node.js `20.9+`.
9. Nu introduce `any` inutil. Folosește tipurile generate de Payload.
10. La final trebuie să funcționeze:
    - `npm run typecheck`;
    - `npm run lint`;
    - `npm run build`;
    - `npm run dev`;
    - autentificarea și CRUD-ul din `/admin`;
    - toate paginile publice;
    - formularul de contact.

### Mod de lucru recomandat

Creează mai întâi o ramură separată:

```bash
git checkout -b feat/next-payload-migration
```

Înainte de modificări, rulează proiectul actual și notează comportamentul și eventualele erori deja existente:

```bash
npm ci
npm run build
npm run lint
```

Fă migrarea în fazele descrise mai jos. După fiecare fază importantă rulează cel puțin:

```bash
npm run typecheck
npm run build
```

Nu șterge fișierele Vite până când echivalentele Next.js nu funcționează.

---

## 1. Situația actuală

Proiectul CarFix este în prezent:

- React 19;
- Vite;
- React Router;
- Tailwind CSS 4 prin pluginul Vite;
- pagini randate client-side;
- date hardcodate în `src/lib/data.ts`;
- pseudo-admin custom la `/admin`;
- pseudo-persistență prin `localStorage`, folosind `src/hooks/useKV.ts`;
- SEO modificat în browser prin `SEOHead.tsx`;
- formulare salvate local, nu într-o bază de date reală.

### Probleme care trebuie eliminate

- Conținutul adăugat în admin este vizibil doar în browserul în care a fost creat.
- Ștergerea storage-ului browserului șterge modificările.
- `/admin` nu este un CMS securizat real.
- Cererile din formular nu ajung într-o bază de date reală.
- Meta tagurile dinamice sunt injectate client-side, mai slab pentru SEO și social previews.
- Blogul și portofoliul folosesc ID-uri hardcodate și date statice.

---

## 2. Arhitectura țintă

Aplicația finală trebuie să fie un proiect unic:

```text
Next.js 16 App Router
├── site public
├── Payload Admin la /admin
├── Payload REST API la /api/...
├── Payload Local API folosit server-side
├── PostgreSQL
├── media uploads
├── formulare persistente
└── notificări email opționale prin Resend
```

### Decizii arhitecturale

- Framework: Next.js App Router.
- CMS/backend: Payload CMS 3.
- Database: PostgreSQL prin `@payloadcms/db-postgres`.
- Rich text:
  - Payload Lexical unde este util;
  - pentru articolele Markdown existente, vezi strategia din secțiunea de seed.
- Site public:
  - Server Components pentru citirea conținutului și metadata;
  - Client Components numai pentru animații, formulare, meniuri și alte interacțiuni.
- Media:
  - local în development;
  - storage persistent în production;
  - providerul trebuie configurat fără a bloca rularea locală.
- Email:
  - Resend opțional pentru notificarea cererilor noi;
  - cererea trebuie salvată chiar dacă emailul eșuează.

---

## 3. Structura finală recomandată

```text
carfix-paint-premium/
├── public/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── servicii/page.tsx
│   │   │   ├── daune/page.tsx
│   │   │   ├── portofoliu/page.tsx
│   │   │   ├── portofoliu/[slug]/page.tsx
│   │   │   ├── despre/page.tsx
│   │   │   ├── recenzii/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── politica-confidentialitate/page.tsx
│   │   │   ├── politica-cookies/page.tsx
│   │   │   └── termeni-conditii/page.tsx
│   │   ├── (payload)/
│   │   │   ├── admin/[[...segments]]/page.tsx
│   │   │   ├── admin/[[...segments]]/not-found.tsx
│   │   │   ├── api/[...slug]/route.ts
│   │   │   ├── api/graphql/route.ts
│   │   │   ├── api/graphql-playground/route.ts
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── contact/route.ts
│   │   ├── globals.css
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── not-found.tsx
│   │   └── layout.tsx
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Services.ts
│   │   ├── PortfolioProjects.ts
│   │   ├── BlogPosts.ts
│   │   ├── Reviews.ts
│   │   ├── FAQs.ts
│   │   └── ContactRequests.ts
│   ├── globals/
│   │   ├── SiteSettings.ts
│   │   ├── Homepage.ts
│   │   └── LegalPages.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── forms/
│   │   ├── cms/
│   │   └── ui/
│   ├── lib/
│   │   ├── payload.ts
│   │   ├── queries.ts
│   │   ├── media.ts
│   │   ├── metadata.ts
│   │   ├── validation.ts
│   │   └── utils.ts
│   ├── seed/
│   │   ├── legacy-data.ts
│   │   └── seed.ts
│   ├── hooks/
│   └── payload-types.ts
├── payload.config.ts
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs
├── docker-compose.yml
├── .env.example
└── package.json
```

Structura exactă a componentelor poate fi adaptată, dar separarea dintre `(frontend)` și `(payload)` este obligatorie, astfel încât adminul Payload să nu primească Header, Footer sau alte elemente ale site-ului public.

---

## 4. Faza 1 — Înlocuirea Vite cu Next.js

### 4.1. Actualizează dependențele

Păstrează inițial dependențele UI existente. Adaugă:

```bash
npm install next@^16.2.6 payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp graphql resend sanitize-html
npm install -D tsx @types/sanitize-html
```

Verifică după instalare ca:

- `payload`;
- `@payloadcms/next`;
- `@payloadcms/db-postgres`;
- `@payloadcms/richtext-lexical`;

să aibă aceeași versiune.

Nu elimina `react-router-dom` și Vite înainte ca toate rutele să fie migrate. La final elimină:

```bash
npm uninstall vite @vitejs/plugin-react-swc @tailwindcss/vite react-router-dom
```

Elimină și alte pachete nefolosite numai după verificarea importurilor.

### 4.2. Înlocuiește scripturile din `package.json`

Ținta recomandată:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "generate:types": "payload generate:types",
    "generate:importmap": "payload generate:importmap --disable-transpile",
    "payload": "payload",
    "seed": "tsx src/seed/seed.ts",
    "migrate:create": "payload migrate:create",
    "migrate": "payload migrate"
  }
}
```

Păstrează scripturile Playwright existente dacă testele sunt încă utile.

### 4.3. Creează `next.config.mjs`

Folosește `withPayload`.

Cerințe:

- ESM;
- `output: 'standalone'`;
- remote image patterns pentru sursele de imagini existente;
- configurație pentru domeniul final;
- fără redirect Flower Power.

Exemplu orientativ:

```js
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
```

Nu copia domeniile sau redirecturile din Flower Power.

### 4.4. Migrează Tailwind CSS 4

Elimină pluginul Tailwind pentru Vite și folosește PostCSS.

Creează `postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Mută/importă CSS-ul global în `src/app/globals.css`.

Păstrează toate variabilele CSS și stilurile din:

- `src/main.css`;
- `src/index.css`;
- `src/styles/theme.css`.

Nu modifica tema vizuală decât dacă este necesar pentru compatibilitate.

### 4.5. Actualizează `tsconfig.json`

Pornește de la un `tsconfig` compatibil Next.js și păstrează aliasul `@/*`.

Include obligatoriu:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./payload.config.ts"]
    },
    "plugins": [{ "name": "next" }],
    "strict": true,
    "noEmit": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

Nu păstra `allowImportingTsExtensions` dacă nu mai este necesar.

---

## 5. Faza 2 — Integrarea Payload CMS

### 5.1. Creează `payload.config.ts`

Configurația trebuie să conțină:

- editor Lexical;
- PostgreSQL;
- colecțiile descrise mai jos;
- globals;
- `sharp`;
- TypeScript output;
- secret exclusiv din environment;
- `serverURL` din environment;
- CORS/CSRF configurate doar pentru domeniile reale necesare.

Exemplu orientativ:

```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Services } from './src/collections/Services'
import { PortfolioProjects } from './src/collections/PortfolioProjects'
import { BlogPosts } from './src/collections/BlogPosts'
import { Reviews } from './src/collections/Reviews'
import { FAQs } from './src/collections/FAQs'
import { ContactRequests } from './src/collections/ContactRequests'
import { SiteSettings } from './src/globals/SiteSettings'
import { Homepage } from './src/globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET is required in production')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Services,
    PortfolioProjects,
    BlogPosts,
    Reviews,
    FAQs,
    ContactRequests,
  ],
  globals: [SiteSettings, Homepage],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.PAYLOAD_SECRET ?? 'development-only-secret',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  sharp,
})
```

Cheia fallback este permisă doar pentru development local. Nu folosi o cheie predictibilă în producție.

### 5.2. Montează adminul și API-ul Payload

Copiază structura oficială curentă din template-ul Payload Blank pentru:

```text
src/app/(payload)/admin/[[...segments]]/page.tsx
src/app/(payload)/admin/[[...segments]]/not-found.tsx
src/app/(payload)/api/[...slug]/route.ts
src/app/(payload)/api/graphql/route.ts
src/app/(payload)/api/graphql-playground/route.ts
src/app/(payload)/layout.tsx
```

Nu reutiliza manual pagina custom `AdminPage.tsx`.

După integrare:

```bash
npm run generate:importmap
npm run generate:types
```

### 5.3. Helper Local API

Creează `src/lib/payload.ts`:

```ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}
```

Folosește Local API în Server Components și route handlers. Nu face request HTTP către propriul REST API din Server Components.

---

## 6. Modelul de date Payload

### 6.1. `users`

Scop: autentificarea în admin.

Câmpuri:

- `email` prin `auth: true`;
- `name` text;
- `role` select:
  - `admin`;
  - `editor`.

Reguli:

- doar adminii pot șterge alți utilizatori;
- editorii pot administra conținutul, dar nu utilizatorii;
- nu expune utilizatorii public prin API.

### 6.2. `media`

Câmpuri:

- upload activ;
- `alt` obligatoriu;
- `caption` opțional;
- `category` opțional:
  - `blog`;
  - `portfolio-before`;
  - `portfolio-after`;
  - `general`.

Adaugă image sizes utile, de exemplu:

- thumbnail;
- card;
- hero.

Publicul poate citi media. Doar utilizatorii autentificați pot crea, edita sau șterge.

### 6.3. `services`

Câmpuri:

- `name` — text, required;
- `slug` — text, required, unique, index;
- `icon` — select din iconurile folosite în aplicație;
- `shortDescription` — textarea;
- `description` — rich text sau textarea;
- `features` — array cu `feature`;
- `featured` — checkbox;
- `active` — checkbox, default true;
- `order` — number;
- `seoTitle`;
- `seoDescription`.

Public read numai pentru `active = true`.

### 6.4. `portfolio-projects`

Câmpuri:

- `title` — required;
- `slug` — required, unique, index;
- `legacyId` — text, pentru redirecturile articolelor vechi;
- `description` — textarea/rich text;
- `services` — relationship `hasMany` către `services`;
- `beforeImage` — upload către `media`, required;
- `afterImage` — upload către `media`, required;
- `gallery` — array opțional de imagini;
- `duration` — text;
- `vehicleBrand` — text opțional;
- `vehicleModel` — text opțional;
- `featured` — checkbox;
- `publishedAt` — date;
- `status` — draft/published sau Payload drafts;
- `order` — number;
- câmpuri SEO.

Recomandat:

```ts
versions: {
  drafts: true,
}
```

Public read numai pentru proiecte publicate.

### 6.5. `blog-posts`

Câmpuri:

- `title` — required;
- `slug` — required, unique, index;
- `legacyId` — text;
- `excerpt` — textarea;
- `coverImage` — upload;
- `body` — richText, pentru conținut nou;
- `legacyMarkdown` — textarea, pentru articolele importate din `data.ts`;
- `publishedAt` — date;
- `readTime` — text sau number;
- `category` — select;
- `featured` — checkbox;
- drafts/versions;
- `seoTitle`;
- `seoDescription`;
- `ogImage` opțional.

Strategie de randare:

1. dacă `body` are conținut, randează Lexical RichText;
2. altfel, dacă există `legacyMarkdown`, randează Markdown sanitizat;
3. nu folosi `dangerouslySetInnerHTML` fără sanitizare.

Acest fallback permite importarea fără pierderi a articolelor existente, apoi migrarea lor graduală în Lexical.

Public read numai pentru articole publicate.

### 6.6. `reviews`

Câmpuri:

- `name` — required;
- `rating` — number, min 1, max 5;
- `text` — textarea, required;
- `date` — date;
- `service` — relationship opțional către `services`;
- `approved` — checkbox, default false;
- `featured` — checkbox;
- `order` — number.

Public read numai pentru `approved = true`.

### 6.7. `faqs`

Câmpuri:

- `question` — required;
- `answer` — textarea sau richText;
- `category` — select opțional;
- `published` — checkbox, default true;
- `order` — number.

Public read numai pentru `published = true`.

### 6.8. `contact-requests`

Câmpuri:

- `name` — required;
- `phone` — required;
- `email` — email opțional;
- `carBrand` — text;
- `licensePlate` — text;
- `service` — relationship sau select;
- `message` — textarea;
- `gdprConsent` — checkbox, required true;
- `photos` — upload/relationship hasMany opțional;
- `status` — select:
  - `new`;
  - `contacted`;
  - `scheduled`;
  - `closed`;
  - `spam`;
- `source` — text, default `website`;
- `submittedAt` — date;
- `ip` — text, admin only;
- `userAgent` — text, admin only.

Access control obligatoriu:

- public poate doar crea;
- public nu poate citi, lista, edita sau șterge;
- utilizatorii autentificați pot citi și actualiza;
- doar adminul poate șterge.

Nu expune datele personale în pagini publice sau în sitemap.

### 6.9. Global `site-settings`

Mută în Payload informațiile din `COMPANY_INFO`:

- nume firmă;
- telefon;
- număr WhatsApp;
- mesaj WhatsApp implicit;
- email;
- adresă;
- program;
- Google Maps URL;
- coordonate;
- Facebook;
- Instagram;
- domeniu canonical;
- imagine OG implicită;
- texte CTA globale.

Read public, update numai autentificat.

### 6.10. Global `homepage`

Conținut editabil recomandat:

- badge hero;
- titlu hero;
- text accentuat separat;
- descriere hero;
- texte CTA;
- beneficii;
- titlurile secțiunilor;
- pașii procesului pentru daune;
- numărul de servicii/proiecte/recenzii afișate;
- CTA final.

Nu este obligatoriu să faci absolut fiecare text editabil în prima versiune. Prioritizează conținutul comercial important și păstrează designul actual.

---

## 7. Faza 3 — Migrarea layoutului și rutelor

### 7.1. Elimină React Router gradual

Maparea obligatorie:

| Rută actuală | Rută Next.js |
|---|---|
| `/` | `src/app/(frontend)/page.tsx` |
| `/servicii` | `src/app/(frontend)/servicii/page.tsx` |
| `/daune` | `src/app/(frontend)/daune/page.tsx` |
| `/portofoliu` | `src/app/(frontend)/portofoliu/page.tsx` |
| `/portofoliu/:id` | `src/app/(frontend)/portofoliu/[slug]/page.tsx` |
| `/despre` | `src/app/(frontend)/despre/page.tsx` |
| `/recenzii` | `src/app/(frontend)/recenzii/page.tsx` |
| `/faq` | `src/app/(frontend)/faq/page.tsx` |
| `/blog` | `src/app/(frontend)/blog/page.tsx` |
| `/blog/:id` | `src/app/(frontend)/blog/[slug]/page.tsx` |
| `/contact` | `src/app/(frontend)/contact/page.tsx` |
| `/politica-confidentialitate` | ruta Next echivalentă |
| `/politica-cookies` | ruta Next echivalentă |
| `/termeni-conditii` | ruta Next echivalentă |
| `/admin` | Payload CMS |

Înlocuiește:

- `Link` din `react-router-dom` cu `next/link`;
- `useNavigate()` cu `useRouter()` din `next/navigation`, numai în Client Components;
- navigarea simplă prin butoane cu `Link` când este posibil;
- `useParams()` cu `params` primit de pagina Next;
- `useLocation()` cu metadata/routing Next.

La final, `src/App.tsx` și `src/main.tsx` nu mai trebuie folosite.

### 7.2. Layout public

`src/app/(frontend)/layout.tsx` trebuie să includă:

- Header;
- `<main>`;
- Footer;
- FloatingActions;
- Toaster;
- providerii necesari.

Adminul Payload nu trebuie să folosească acest layout.

### 7.3. Server Components versus Client Components

Regulă:

- pagina de rută citește datele Payload server-side;
- componenta vizuală primește datele prin props;
- numai partea care folosește hooks, Framer Motion sau event handlers primește `'use client'`.

Exemplu:

```tsx
// src/app/(frontend)/page.tsx
import { getHomepageData } from '@/lib/queries'
import { HomePageClient } from '@/components/pages/HomePageClient'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await getHomepageData()
  return <HomePageClient {...data} />
}
```

În prima versiune folosește `dynamic = 'force-dynamic'` pentru paginile CMS, pentru corectitudine. Nu introduce cache complex înainte să funcționeze CRUD-ul și publicarea.

Ulterior se poate adăuga revalidare prin tags și hooks Payload.

### 7.4. Păstrarea componentelor UI

Păstrează `src/components/ui/*` și adaptează doar importurile sau client boundaries.

Componente care probabil trebuie să fie Client Components:

- Header dacă gestionează meniul mobil;
- FloatingActions;
- componente cu Framer Motion;
- formulare;
- Toaster;
- accordion/tabs interactive;
- hooks mobile.

Nu marca întregul layout sau toate paginile `'use client'` doar pentru comoditate.

---

## 8. Faza 4 — Query layer și integrarea paginilor

Creează funcții clare în `src/lib/queries.ts`.

Exemple:

```ts
export async function getSiteSettings() {}
export async function getHomepage() {}
export async function getServices() {}
export async function getFeaturedServices() {}
export async function getPortfolioProjects() {}
export async function getPortfolioProjectBySlug(slug: string) {}
export async function getBlogPosts() {}
export async function getBlogPostBySlug(slug: string) {}
export async function getApprovedReviews() {}
export async function getFAQs() {}
```

### Reguli pentru queries

- folosește `getPayloadClient()`;
- setează limite explicite;
- sortează prin `order`, `publishedAt` sau `date`;
- folosește `depth` suficient pentru media și relationships;
- nu returna drafturi în public;
- tratează rezultatele lipsă cu `notFound()`;
- nu presupune că relationship-ul este întotdeauna populat complet;
- folosește tipurile din `payload-types.ts`.

### Home

Înlocuiește importurile directe din `src/lib/data.ts` pentru:

- `SERVICES`;
- `REVIEWS`;
- `PORTFOLIO_PROJECTS`;
- `COMPANY_INFO`.

Datele trebuie venite din Payload.

### Servicii

Pagina `/servicii` trebuie să listeze serviciile active, ordonate.

### Portofoliu

- lista folosește proiectele publicate;
- detaliul caută după `slug`;
- imaginea înainte și după vin din Media;
- folosește `next/image` unde este rezonabil;
- păstrează layoutul before/after actual.

### Blog

- lista folosește articolele publicate;
- detaliul caută după `slug`;
- suportă `body` Lexical și fallback `legacyMarkdown`;
- Markdown-ul trebuie sanitizat;
- nu randa HTML arbitrar nesanitizat.

### Reviews și FAQ

- reviews: doar aprobate;
- FAQs: doar publicate;
- ordonare stabilă.

### Site settings

Header, Footer, FloatingActions și CTA-urile trebuie să primească setările site-ului prin props sau printr-un helper server-side, nu prin import hardcodat.

---

## 9. Faza 5 — Seed din datele existente

### 9.1. Obiectiv

Importă datele curente din `src/lib/data.ts` în PostgreSQL:

- servicii;
- proiecte portofoliu;
- recenzii;
- FAQ;
- blog;
- date companie.

După seed, site-ul trebuie să arate aproape identic cu versiunea actuală chiar înainte ca utilizatorul să editeze ceva în admin.

### 9.2. Seed idempotent

`npm run seed` trebuie să poată fi executat de mai multe ori fără duplicate.

Folosește:

- `slug` ca identificator pentru servicii, proiecte și blog;
- o combinație stabilă pentru reviews/FAQ;
- update dacă documentul există;
- create dacă nu există.

Nu folosi doar `Date.now()` sau ID-uri aleatoare pentru detectarea duplicatelor.

### 9.3. Slug-uri

Generează slug-uri SEO-friendly din titluri, cu diacritice normalizate.

Exemple:

```text
/blog/cum-procedezi-dupa-un-accident-auto
/portofoliu/audi-a4-reparatie-dauna-laterala-completa
```

Păstrează `legacyId` pentru vechile valori numerice.

### 9.4. Redirecturi pentru ID-urile vechi

Pentru `/blog/1` sau `/portofoliu/1`:

- caută `legacyId`;
- dacă există, redirecționează permanent către slug;
- dacă nu există, `notFound()`.

Astfel nu se rup linkurile vechi.

### 9.5. Imagini externe existente

Pentru prima migrare există două variante acceptabile:

1. păstrează temporar URL-urile externe într-un câmp `legacyImageUrl` și folosește fallback;
2. descarcă imaginile și creează documente Media.

Preferința este varianta 2 pentru conținut real. Dacă seed-ul nu poate importa robust imaginile externe, implementează fallback-ul fără să blochezi migrarea.

### 9.6. Articolele Markdown

Nu încerca să generezi manual JSON Lexical fragil.

Importă Markdown-ul existent în `legacyMarkdown`. Articolele noi pot folosi `body` Lexical. Frontendul trebuie să suporte ambele formate.

După ce migrarea funcționează, articolele vechi pot fi mutate manual sau printr-un script separat în Lexical.

### 9.7. Date false/demo

Conținutul existent pare a include date demonstrative, imagini Unsplash și recenzii placeholder. Nu le prezenta în cod ca fiind validate sau reale.

Seed-ul trebuie să le migreze pentru fidelitate vizuală, dar adaugă un comentariu clar în `legacy-data.ts` că datele trebuie verificate înainte de lansarea în producție.

---

## 10. Faza 6 — Formularul de contact real

### 10.1. Elimină persistarea în `localStorage`

Formularul actual nu trebuie să mai utilizeze:

```ts
useKV<ContactFormData[]>('contact-forms', [])
```

`useKV.ts` poate fi eliminat complet dacă nu mai are alte utilizări legitime.

### 10.2. Creează route handler dedicat

Folosește:

```text
POST /api/contact
```

Nu lăsa UI-ul să scrie direct în Payload REST API fără strat de validare.

Route handlerul trebuie să:

1. parseze payloadul;
2. valideze cu Zod;
3. verifice GDPR consent;
4. normalizeze telefonul, emailul și numărul de înmatriculare;
5. aplice limită rezonabilă de lungime;
6. includă un honeypot anti-spam;
7. creeze `contact-requests` prin Payload Local API;
8. returneze un răspuns generic și sigur;
9. trimită opțional un email de notificare.

Schema orientativă:

```ts
const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().optional().or(z.literal('')),
  carBrand: z.string().trim().max(100).optional(),
  licensePlate: z.string().trim().max(20).optional(),
  serviceType: z.string().trim().min(1).max(100),
  message: z.string().trim().max(3000).optional(),
  gdprConsent: z.literal(true),
  company: z.string().max(0).optional(),
})
```

`company` este honeypot și trebuie să rămână gol.

### 10.3. Email prin Resend

Dacă există:

```text
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_NOTIFICATION_EMAIL
```

trimite email către service după salvarea în DB.

Reguli:

- salvarea în DB este sursa principală;
- eșecul emailului nu trebuie să piardă cererea;
- nu trimite secrete sau stack traces clientului;
- loghează server-side ID-ul cererii și eroarea emailului;
- emailul trebuie să includă un link către documentul din Payload admin dacă poate fi construit sigur.

### 10.4. UX formular

Păstrează designul actual și adaugă:

- loading state;
- dezactivarea butonului în timpul submitului;
- success state real doar după răspuns 2xx;
- mesaje de validare;
- eroare generică la probleme server;
- prevenirea dublului submit;
- resetarea formularului după succes.

### 10.5. Upload fotografii

Dacă uploadul foto nu este finalizat în UI-ul actual, implementează-l doar dacă poate fi făcut corect în această migrare.

Cerințe minime dacă este implementat:

- maximum 5 fișiere;
- tipuri JPEG, PNG, WEBP;
- limită per fișier;
- upload în Media;
- relație cu cererea de contact;
- validare server-side, nu doar client-side.

Dacă uploadul complică stabilitatea primei versiuni, lasă-l într-o fază separată, dar nu simula succesul.

---

## 11. Faza 7 — SEO și metadata Next.js

### 11.1. Elimină `SEOHead.tsx`

Nu mai modifica `document.title` și meta tagurile prin `useEffect`.

Folosește:

- `metadata` static pentru pagini statice;
- `generateMetadata()` pentru blog și portofoliu;
- `metadataBase` în root layout;
- canonical URLs;
- Open Graph;
- Twitter cards;
- robots;
- sitemap.

### 11.2. Dynamic metadata

Pentru blog:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug)
  // title, description, canonical, OG image etc.
}
```

Pentru portofoliu la fel.

Folosește câmpurile SEO Payload, cu fallback la title/excerpt/site settings.

### 11.3. Structured data

Migrează `StructuredData.tsx` la JSON-LD server-rendered.

Include când este relevant:

- `AutoRepair` sau `LocalBusiness`;
- `FAQPage`;
- `BlogPosting`;
- breadcrumbs;
- date reale din `site-settings`.

Nu păstra valori false sau neverificate precum număr de clienți, rating sau ani de experiență fără confirmare.

### 11.4. `robots.ts`

Adminul și API-urile trebuie excluse din indexare:

```text
/admin
/api
```

### 11.5. `sitemap.ts`

Include:

- paginile statice;
- articolele publicate;
- proiectele publicate.

Nu include:

- admin;
- contact requests;
- drafturi;
- API routes.

---

## 12. Faza 8 — Media și storage

### Development

Payload poate salva media local, în directorul configurat pentru upload.

### Production

Nu presupune că filesystem-ul este persistent.

Implementează configurarea astfel încât aplicația să poată folosi un storage extern fără rescriere majoră. Variante acceptate:

- Cloudflare R2 / S3-compatible prin `@payloadcms/storage-s3`;
- AWS S3;
- Vercel Blob dacă deploymentul final este Vercel.

Recomandare generică:

- local storage când `S3_BUCKET` lipsește;
- activează S3 plugin numai când variabilele sunt prezente.

Variabile orientative:

```text
S3_BUCKET=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL=
```

Nu include credențiale în Git.

Dacă deploymentul este pe un VPS cu volum persistent, storage local poate fi folosit în producție, dar directorul uploadurilor trebuie montat persistent și inclus în backup.

---

## 13. Faza 9 — PostgreSQL și migrations

### 13.1. Development local

Adaugă `docker-compose.yml` minimal:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: carfix
      POSTGRES_USER: carfix
      POSTGRES_PASSWORD: carfix
    ports:
      - "5432:5432"
    volumes:
      - carfix_postgres_data:/var/lib/postgresql/data

volumes:
  carfix_postgres_data:
```

`.env.local` local:

```text
DATABASE_URL=postgresql://carfix:carfix@localhost:5432/carfix
```

Nu folosi această parolă în producție.

### 13.2. Migrations

În development se poate folosi schema push pentru iterare, dar înainte de production:

```bash
npm run migrate:create
npm run migrate
```

Include migrations în Git.

Nu amesteca fără control push-ul automat cu migrations în același mediu de producție.

### 13.3. Backup

Documentează în README:

- backup DB;
- backup media;
- restaurare;
- variabile de mediu.

---

## 14. Environment variables

Creează `.env.example`:

```dotenv
# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Payload
PAYLOAD_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://carfix:carfix@localhost:5432/carfix

# Email notifications — optional
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_NOTIFICATION_EMAIL=

# Optional S3-compatible storage
S3_BUCKET=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL=
```

Reguli:

- `.env*` reale rămân în `.gitignore`;
- `.env.example` nu conține secrete reale;
- buildul production trebuie să eșueze clar dacă lipsesc `PAYLOAD_SECRET` sau `DATABASE_URL`;
- aplicația poate porni fără Resend sau S3 în development.

---

## 15. Faza 10 — Eliminarea codului legacy

Elimină numai după ce echivalentele funcționează:

- `src/main.tsx`;
- `src/App.tsx`;
- `index.html` Vite;
- `vite.config.ts`;
- pagina custom `src/components/pages/AdminPage.tsx`;
- `src/hooks/useKV.ts`, dacă nu mai există cazuri legitime;
- `SEOHead.tsx`;
- vechiul `StructuredData.tsx`, după înlocuire;
- datele hardcodate folosite în runtime;
- dependența `react-router-dom`;
- pluginurile Vite.

Datele legacy pentru seed pot rămâne în `src/seed/legacy-data.ts`, marcate clar ca seed/demo și neimportate de runtime-ul paginilor.

Caută după migrare:

```bash
rg "react-router-dom|useNavigate|useParams|useLocation|BrowserRouter|Routes|Route" src
rg "useKV|localStorage" src
rg "BLOG_POSTS|PORTFOLIO_PROJECTS|REVIEWS|SERVICES|FAQ_ITEMS|COMPANY_INFO" src
rg "document\.title|updateMetaTag|dangerouslySetInnerHTML" src
```

Rezultatele rămase trebuie justificate.

---

## 16. Erori și stări goale

Implementează:

- `src/app/not-found.tsx`;
- UI pentru colecții goale;
- fallback pentru media lipsă;
- error handling în queries;
- submit errors pentru contact;
- 404 real pentru blog/proiect inexistent;
- loading state pentru formulare;
- admin separat de frontend.

Nu lăsa site-ul să crape dacă un editor șterge o imagine sau lasă un câmp opțional gol.

---

## 17. Access control și securitate

Checklist obligatoriu:

- [ ] `users` nu este public.
- [ ] contact requests nu pot fi citite public.
- [ ] public poate doar crea contact requests prin endpointul validat.
- [ ] drafturile nu apar public.
- [ ] media write este doar autentificat.
- [ ] secretul Payload nu este hardcodat în production.
- [ ] inputurile formularului sunt validate server-side.
- [ ] Markdown-ul legacy este sanitizat.
- [ ] API errors nu expun stack traces.
- [ ] `/admin` are `noindex`.
- [ ] nu există credentiale în repo.
- [ ] uploadurile au limite de tip și dimensiune.
- [ ] câmpurile PII nu apar în loguri fără motiv.

Pentru operații Local API care trebuie să respecte access control, verifică explicit comportamentul `overrideAccess` și setează-l corespunzător. Nu presupune că Local API aplică automat toate regulile REST.

---

## 18. Testare

### 18.1. Build și quality gates

Rulează:

```bash
npm run generate:types
npm run generate:importmap
npm run typecheck
npm run lint
npm run build
```

### 18.2. Test manual public

Verifică desktop și mobile:

- [ ] Home.
- [ ] Servicii.
- [ ] Daune.
- [ ] Portofoliu listă.
- [ ] Portofoliu detaliu.
- [ ] Despre.
- [ ] Recenzii.
- [ ] FAQ.
- [ ] Blog listă.
- [ ] Blog detaliu.
- [ ] Contact.
- [ ] Politici și termeni.
- [ ] Header și meniul mobil.
- [ ] Footer.
- [ ] WhatsApp și telefon.
- [ ] animații Framer Motion.
- [ ] 404.

### 18.3. Test Payload

- [ ] primul user admin poate fi creat sau seed-uit sigur;
- [ ] login/logout;
- [ ] CRUD servicii;
- [ ] CRUD portofoliu;
- [ ] CRUD blog;
- [ ] upload media;
- [ ] publish/draft;
- [ ] reviews și FAQs;
- [ ] contact requests vizibile doar autentificat;
- [ ] modificările apar pe site după refresh.

### 18.4. Test formular

- [ ] validare client;
- [ ] validare server;
- [ ] GDPR obligatoriu;
- [ ] honeypot;
- [ ] cerere salvată în DB;
- [ ] status `new` implicit;
- [ ] dublu click nu creează duplicate evidente;
- [ ] email trimis când Resend este configurat;
- [ ] cererea rămâne salvată dacă Resend eșuează.

### 18.5. Test SEO

- [ ] HTML-ul inițial conține title și description;
- [ ] dynamic metadata pentru blog;
- [ ] dynamic metadata pentru portofoliu;
- [ ] canonical corect;
- [ ] OG image corect;
- [ ] JSON-LD valid;
- [ ] sitemap conține conținutul publicat;
- [ ] admin/API excluse din robots.

---

## 19. Definition of Done

Migrarea este finalizată numai când toate condițiile sunt îndeplinite:

1. Proiectul nu mai folosește Vite la runtime sau build.
2. Proiectul nu mai folosește React Router.
3. `/admin` este Payload CMS funcțional și securizat.
4. Conținutul principal este editabil în Payload.
5. Datele existente sunt importate prin seed idempotent.
6. Pagina publică nu citește conținut CMS din `localStorage`.
7. Formularul creează cereri reale în PostgreSQL.
8. Site-ul păstrează fidel designul existent.
9. Blogul și portofoliul au pagini server-rendered și metadata dinamică.
10. Toate paginile și linkurile publice funcționează.
11. Buildul production este valid.
12. Nu există secrete hardcodate.
13. Access control-ul pentru date private este verificat.
14. README-ul conține instrucțiuni de instalare, seed, migrations și deployment.

---

## 20. Ordinea concretă de execuție

Urmează această ordine pentru a reduce riscul:

1. Creează branch.
2. Salvează baseline build și screenshots.
3. Instalează Next și Payload fără să elimini Vite imediat.
4. Creează configurația Next, Payload, PostCSS și TypeScript.
5. Montează `/admin` și Payload API.
6. Configurează PostgreSQL local.
7. Creează colecțiile și globals.
8. Generează types și import map.
9. Creează root layout și frontend layout.
10. Migrează Header, Footer, FloatingActions și Toaster.
11. Migrează paginile statice la App Router.
12. Creează query layer Payload.
13. Creează seed idempotent și importă datele existente.
14. Conectează Home, Services, Reviews și FAQ.
15. Conectează Portfolio list/detail.
16. Conectează Blog list/detail cu Lexical + Markdown fallback.
17. Înlocuiește formularul local cu `/api/contact`.
18. Adaugă notificare Resend opțională.
19. Migrează metadata, JSON-LD, sitemap și robots.
20. Adaugă 404, empty states și error handling.
21. Elimină React Router, Vite, custom admin și `useKV`.
22. Rulează seed pe DB goală.
23. Rulează toate quality gates.
24. Compară vizual cu site-ul original.
25. Actualizează README.

---

## 21. Ce nu trebuie făcut în această migrare

- Nu redesena site-ul.
- Nu schimba textele comerciale fără motiv.
- Nu crea aplicație separată `cms/` dacă integrarea Next + Payload funcționează.
- Nu introduce Laravel, Express sau NestJS.
- Nu face fetch client-side pentru tot conținutul.
- Nu copia baza SQLite Flower Power în production.
- Nu păstra adminul custom la alt URL.
- Nu expune contact requests prin API public read.
- Nu elimina conținutul existent înainte să fie seed-uit.
- Nu face schimbări ample de UI sub pretextul migrației.
- Nu considera toast-ul de succes drept dovadă că formularul a fost salvat.
- Nu folosi valori false în structured data.

---

## 22. Livrabile finale cerute de la Cursor

La final, Cursor trebuie să prezinte:

1. rezumatul arhitecturii implementate;
2. lista principalelor fișiere create/modificate;
3. lista dependențelor adăugate/eliminate;
4. comenzile necesare pentru local development;
5. variabilele de mediu necesare;
6. cum se rulează seed-ul;
7. cum se creează și rulează migrations;
8. cum se creează primul admin;
9. strategia de media storage pentru production;
10. rezultatul comenzilor typecheck/lint/build;
11. orice limitare rămasă, explicită și verificabilă;
12. pașii exacți pentru deployment.

Nu raporta o fază ca finalizată dacă nu a fost executată sau verificată.

---

## 23. Referințe tehnice

- Payload installation: <https://payloadcms.com/docs/getting-started/installation>
- Payload PostgreSQL adapter: <https://payloadcms.com/docs/database/postgres>
- Payload storage adapters: <https://payloadcms.com/docs/upload/storage-adapters>
- Payload production deployment: <https://payloadcms.com/docs/production/deployment>
- Next.js App Router: <https://nextjs.org/docs/app>

Repo-ul Flower Power poate fi folosit ca referință pentru:

- montarea adminului Payload;
- montarea REST routes;
- `withPayload`;
- helperul Local API;
- organizarea generală Next + Payload.

Nu trebuie copiate setările specifice Flower Power, baza SQLite, secretul fallback sau versiunile incompatibile.
