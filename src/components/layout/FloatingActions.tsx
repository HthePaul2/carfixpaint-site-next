'use client'

import { WhatsappLogo, Phone } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'

export function FloatingActions() {
  const isMobile = useIsMobile()
  const company = useSiteSettings()

  const whatsappLink = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
    company.whatsappMessage
  )}`

  return (
    <>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <WhatsappLogo size={28} weight="fill" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 1.5, repeat: 3, repeatDelay: 3 }}
          className="absolute inset-0 rounded-full bg-[#25D366] -z-10"
        />
      </motion.a>

      {isMobile && (
        <motion.a
          href={`tel:${company.phone.replace(/\s/g, '')}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-accent text-accent-foreground shadow-lg"
        >
          <div className="container py-3 flex items-center justify-center gap-2">
            <Phone size={22} weight="bold" />
            <span className="font-semibold text-lg">Sună Acum - {company.phone}</span>
          </div>
        </motion.a>
      )}
    </>
  )
}
