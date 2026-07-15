# Plan OG images — CarFix Paint

Format recomandat: **~1200 × 630** (sau apropiat), JPG optimizat.

## Acoperire curentă

| Asset | Destinație CMS |
|-------|----------------|
| `/og/home.jpg` | Homepage → `ogImage` |
| `/og/servicii.jpg` | Static pages → Servicii |
| `/og/daune-rca-casco.jpg` | Static pages → Daune |
| `/og/portofoliu.jpg` | Static pages → Portofoliu (index) |
| `/og/despre.jpg` | Static pages → Despre |
| `/og/recenzii.jpg` | Static pages → Recenzii |
| `/og/faq.jpg` | Static pages → FAQ |
| `/og/blog.jpg` | Static pages → Blog (index) |
| `/og/contact.jpg` | Static pages → Contact |
| `/og/portofoliu-exemplu.jpg` | Site settings → `portfolioDefaultOgImage` |
| `/og-image.png` | Site settings → `defaultOgImage` (fallback global) |

Sursă fișiere: `content-assets/carfix-paint-og-images/`.

## Fallback pe proiecte portofoliu

1. `ogImage` dedicat pe proiect (dacă e setat în admin)
2. `portfolioDefaultOgImage` (`portofoliu-exemplu`)
3. `defaultOgImage` (site-wide)

**Nu** se folosesc before/after ca OG.

## Blog

Articole: `ogImage` dedicat → cover → `defaultOgImage`.

## Legal

Paginile legale pot rămâne pe `defaultOgImage`.
