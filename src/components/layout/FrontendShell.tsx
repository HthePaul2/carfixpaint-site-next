import type { SiteInfoView } from '@/lib/cms-types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { DelayedToaster } from '@/components/layout/DelayedToaster'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
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
      <div className="flex min-h-screen flex-col">
        <Header company={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer company={siteSettings} />
        <FloatingActions company={siteSettings} />
        <ScrollToTop />
        <DelayedToaster />
      </div>
    </SiteSettingsProvider>
  )
}
