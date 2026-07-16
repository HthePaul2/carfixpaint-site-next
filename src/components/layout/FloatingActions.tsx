'use client'

import { WhatsappLogo } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function FloatingActions() {
  const isMobile = useIsMobile()
  const company = useSiteSettings()
  const whatsappLink = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  if (isMobile) {
    return (
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#25D366] text-white shadow-lg"
      >
        <div className="container flex items-center justify-center gap-2 py-3">
          <WhatsappLogo size={22} weight="fill" />
          <span className="text-lg font-semibold">Scrie-ne pe WhatsApp</span>
        </div>
      </motion.a>
    )
  }

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#20BA5A] hover:shadow-xl"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scrie-ne pe WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" />
    </motion.a>
  )
}
