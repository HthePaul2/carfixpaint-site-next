# Content assets

Place branding and marketing media here before copying to `public/`.

Currently wired into the site:

| File | Public path | Usage |
|------|-------------|--------|
| `logo.svg` | `/logo.svg` | Header + footer |
| `hero.png` | `/hero.png` | Homepage hero background |
| `og-image.png` | `/og-image.png` | Default Open Graph image |
| `carfix_portfolio_zip/*.png` | split → `/portfolio/*-{before,after}.jpg` | Portofoliu before/after |

Portofoliul: imaginile originale side-by-side sunt în `carfix_portfolio_zip/`.
Versiunile split (before / after) sunt în `portfolio/` și `public/portfolio/`.

After adding or replacing files here, copy them into `public/` with the same filenames.
