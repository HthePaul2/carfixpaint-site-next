'use client'

import { WhatsappLogo } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function FloatingActions() {
  const isMobile = useIsMobile()
  const company = useSiteSettings()
  const whatsappLink = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  if (isMobile) {
    return (
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#25D366] text-white shadow-lg"
      >
        <div className="container flex items-center justify-center gap-2 py-3">
          <WhatsappLogo size={22} weight="fill" />
          <span className="text-lg font-semibold">Scrie-ne pe WhatsApp</span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#20BA5A] hover:shadow-xl"
      aria-label="Scrie-ne pe WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  )
}
