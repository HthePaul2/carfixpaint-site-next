import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'

import '../globals.css'
import { FrontendShell } from '@/components/layout/FrontendShell'
import { getSiteSettings } from '@/lib/queries'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
  title: {
    default: 'CarFix Paint',
    template: '%s',
  },
  description: 'Service auto tinichigerie, vopsitorie și mecanică în Brașov.',
  applicationName: 'CarFix Paint',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
    <html lang="ro" className={outfit.variable}>
      <body className={`${outfit.className} font-sans antialiased`}>
        <FrontendShell siteSettings={siteSettings}>{children}</FrontendShell>
      </body>
    </html>
  )
}
