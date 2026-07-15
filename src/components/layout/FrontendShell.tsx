'use client'

import type { SiteInfoView } from '@/lib/cms-types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Providers } from '@/components/layout/Providers'
import { SiteSettingsProvider } from '@/components/providers/SiteSettingsProvider'

export function FrontendShell({
  children,
  siteSettings,
}: {
  children: React.ReactNode
  siteSettings: SiteInfoView
}) {
  return (
    <SiteSettingsProvider value={siteSettings}>
      <Providers>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
          <ScrollToTop />
        </div>
      </Providers>
    </SiteSettingsProvider>
  )
}
