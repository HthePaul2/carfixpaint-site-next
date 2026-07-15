# Content assets

Place branding and marketing media here before copying to `public/`.

Currently wired into the site:

| File | Public path | Usage |
|------|-------------|--------|
| `logo.svg` | `/logo.svg` | Header + footer |
| `hero.png` | `/hero.png` | Homepage hero background |
| `og-image.png` | `/og-image.png` | Default Open Graph image |
| `carfix_portfolio_zip/*.png` | split → `/portfolio/*-{before,after}.jpg` | Portofoliu before/after |
| `carfix_blog_zip/*.png` | → `/blog/{slug}.jpg` | Cover articole blog |

Portofoliul: originale side-by-side în `carfix_portfolio_zip/`; split în `portfolio/` + `public/portfolio/`.
Blog: originale în `carfix_blog_zip/`; cover-uri JPEG în `blog/` + `public/blog/`.

After adding or replacing files here, copy them into `public/` with the same filenames.
