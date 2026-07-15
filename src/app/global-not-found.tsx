import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'

import './globals.css'
import { FrontendShell } from '@/components/layout/FrontendShell'
import { NotFoundPage } from '@/components/pages/NotFoundPage'
import { getSiteSettings } from '@/lib/queries'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { absolute: 'Pagina nu a fost găsită - CarFix Paint' },
  robots: { index: false, follow: false },
}

/** Global 404 for unmatched URLs (required with multiple root layouts). */
export default async function GlobalNotFound() {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="ro" className={`${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} font-sans antialiased`}>
        <FrontendShell siteSettings={siteSettings}>
          <NotFoundPage />
        </FrontendShell>
      </body>
    </html>
  )
}
