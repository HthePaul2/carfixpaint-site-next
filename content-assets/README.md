# Content assets

Place branding and marketing media here before copying to `public/`.

Currently wired into the site:

| File | Public path | Usage |
|------|-------------|--------|
| `logo.svg` | `/logo.svg` | Header + footer |
| `hero.png` | `/hero.png` | Homepage hero background |
| `og-image.png` | `/og-image.png` | Default Open Graph image (site-wide) |
| `carfix-paint-og-images/og-home.jpg` | `/og/home.jpg` | Homepage OG |
| `carfix-paint-og-images/og-servicii.jpg` | `/og/servicii.jpg` | `/servicii` OG |
| `carfix-paint-og-images/og-daune-rca-casco.jpg` | `/og/daune-rca-casco.jpg` | `/daune` OG |
| `carfix-paint-og-images/og-portofoliu.jpg` | `/og/portofoliu.jpg` | `/portofoliu` OG |
| `carfix-paint-og-images/og-portofoliu-exemplu.jpg` | `/og/portofoliu-exemplu.jpg` | Default OG for portfolio project pages |
| `carfix-paint-og-images/og-despre.jpg` | `/og/despre.jpg` | `/despre` OG |
| `carfix-paint-og-images/og-recenzii.jpg` | `/og/recenzii.jpg` | `/recenzii` OG |
| `carfix-paint-og-images/og-faq.jpg` | `/og/faq.jpg` | `/faq` OG |
| `carfix-paint-og-images/og-blog.jpg` | `/og/blog.jpg` | `/blog` OG |
| `carfix-paint-og-images/og-contact.jpg` | `/og/contact.jpg` | `/contact` OG |
| `carfix_portfolio_zip/*.png` | split → `/portfolio/*-{before,after}.jpg` | Portofoliu before/after |
| `carfix_blog_zip/*.png` | → `/blog/{slug}.jpg` | Cover articole blog |

Copies for seed/Media also live under `content-assets/og/`.

After adding or replacing files here, copy them into `public/` with the same filenames and re-run `npm run seed`.
