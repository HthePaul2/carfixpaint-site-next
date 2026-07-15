import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'

import '../globals.css'
import { FrontendShell } from '@/components/layout/FrontendShell'
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
  title: {
    default: 'CarFix Paint',
    template: '%s',
  },
  description: 'Service auto tinichigerie, vopsitorie și mecanică în Brașov.',
  applicationName: 'CarFix Paint',
  formatDetection: {
    telephone: true,
    email: true,
  },
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="ro" className={`${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} font-sans antialiased`}>
        <FrontendShell siteSettings={siteSettings}>{children}</FrontendShell>
      </body>
    </html>
  )
}
