# CarFix Paint — Next.js + Payload

Migrarea site-ului public din `site-prezentare` (Vite + React Router) către Next.js App Router + Payload CMS.

## Structură

```text
carfixpaint/
├── site-prezentare/   # site-ul Vite actual — neschimbat
└── site-next/         # aplicația țintă Next.js + Payload
```

## Cerințe

- Node.js 20.9+ (recomandat 24+ pentru Payload 3.85+)
- PostgreSQL local (Homebrew) **sau** Docker

## Setup local

### Variantă recomandată: PostgreSQL Homebrew (fără Docker)

Dacă ai Postgres ca serviciu pe macOS (`brew services list`):

```bash
# creează baza (o singură dată)
/opt/homebrew/opt/postgresql@18/bin/psql -h localhost -d postgres -c "CREATE DATABASE carfix;"

cd site-next
cp .env.example .env.local
# DATABASE_URL=postgresql://YOUR_MAC_USERNAME@localhost:5432/carfix
npm install --legacy-peer-deps
npm run generate:importmap
npm run generate:types
npm run dev
```

### Variantă alternativă: Docker

```bash
docker compose up -d
# DATABASE_URL=postgresql://carfix:carfix@localhost:5432/carfix
```

- Site public: http://localhost:3000
- Payload Admin: http://localhost:3000/admin

`npm run dev` folosește Webpack (recomandat pentru Payload Admin). Varianta Turbopack: `npm run dev:turbo` — poate genera erori `Performance.measure` în consolă (bug Next.js, doar development).

## Seed (import date demo în Postgres)

```bash
npm run seed
```

Scriptul este **idempotent** — poate fi rulat de mai multe ori fără duplicate (upsert pe `slug` / `seedKey`).

Datele provin din `src/seed/data.ts` (re-export prin `src/seed/legacy-data.ts`). **Nu sunt folosite în runtime** — doar pentru seed. Verifică conținutul înainte de producție.

## Media storage

| Mediu | Comportament |
|-------|----------------|
| Development (fără S3) | Fișiere în `./media` (local, gitignored) |
| Production cu S3/R2 | Completează variabilele `S3_*` din `.env` |

Plugin-ul `@payloadcms/storage-s3` se activează automat când `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID` și `S3_SECRET_ACCESS_KEY` sunt setate.

## Migrations (PostgreSQL)

În development, Payload poate sincroniza schema automat. Înainte de producție:

```bash
# creează o migrare din schema curentă
npm run migrate:create

# aplică migrările
npm run migrate
```

Include fișierele din `src/migrations/` în Git. Nu amesteca push automat de schema cu migrations pe același mediu de producție.

## Backup și restaurare

### Baza de date

```bash
# backup
pg_dump -h localhost -U YOUR_USER -d carfix -Fc -f carfix-$(date +%Y%m%d).dump

# restaurare
pg_restore -h localhost -U YOUR_USER -d carfix --clean --if-exists carfix-YYYYMMDD.dump
```

### Media

- **Local**: copiază directorul `media/`
- **S3/R2**: folosește replicarea/versionarea bucket-ului providerului

### Variabile de mediu (producție)

Minim necesare:

```text
NEXT_PUBLIC_SERVER_URL=https://carfixpaint.ro
PAYLOAD_SECRET=<secret lung aleator>
DATABASE_URL=postgresql://...
```

Opționale: `RESEND_*` (email contact), `S3_*` (media).

## Git

Proiectul `site-next` are **repo Git propriu**, separat de `site-prezentare`:

```text
site-prezentare/   → repo vechi (Vite), rămâne neschimbat
site-next/         → repo nou (Next.js + Payload) — aici lucrăm
```

La final, poți fie să înlocuiești deployment-ul cu `site-next`, fie să redenumești folderele.

## Stare migrare

- [x] Faza 1 — scaffold Next.js + Tailwind + Payload minimal
- [x] Faza 2 — colecții și globals complete
- [x] Faza 3 — migrare rute și layout public
- [x] Faza 4 — query layer Payload
- [x] Faza 5 — seed din `src/seed/data.ts`
- [x] Faza 6 — formular contact real (`POST /api/contact` → colecția `contact-requests`)
- [x] Faza 7 — SEO și metadata (`generateMetadata`, sitemap, robots, JSON-LD)
- [x] Faza 8 — media storage S3 condițional
- [x] Faza 9 — docker-compose, migrations, documentație backup
- [x] Faza 10 — cleanup legacy (Vite, React Router, admin fake, `useKV`, runtime `data.ts`)

Planul complet: `CARFIX_PAYLOAD_MIGRATION.md`
