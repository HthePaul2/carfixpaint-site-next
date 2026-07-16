import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'

import './globals.css'
import { FrontendShell } from '@/components/layout/FrontendShell'
import { NotFoundPage } from '@/components/pages/NotFoundPage'
import { getSiteSettings } from '@/lib/queries'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

export const metadata: Metadata = {
  title: { absolute: 'Pagina nu a fost găsită - CarFix Paint' },
  robots: { index: false, follow: false },
}

/** Global 404 for unmatched URLs (required with multiple root layouts). */
export default async function GlobalNotFound() {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="ro" className={outfit.variable}>
      <body className={`${outfit.className} font-sans antialiased`}>
        <FrontendShell siteSettings={siteSettings}>
          <NotFoundPage />
        </FrontendShell>
      </body>
    </html>
  )
}
