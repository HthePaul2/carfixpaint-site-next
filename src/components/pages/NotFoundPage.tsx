'use client'

import { ArrowLeft, WhatsappLogo } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BrandLogo } from '@/components/layout/BrandLogo'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { Button } from '@/components/ui/button'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function NotFoundPage() {
  const router = useRouter()
  const company = useSiteSettings()
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] overflow-hidden bg-primary text-primary-foreground">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="container relative flex flex-1 items-center py-20 md:py-28">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <BrandLogo height={44} variant="onDark" priority />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mb-3 font-[family-name:var(--font-outfit)] text-6xl font-bold leading-none tracking-tight text-accent md:text-7xl"
            aria-hidden
          >
            404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
          >
            Pagina nu a fost găsită
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mb-8 max-w-lg text-lg leading-relaxed text-white/85 md:text-xl"
          >
            Linkul pe care l-ai accesat nu există sau a fost mutat. Te ajutăm să ajungi unde trebuie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="w-full gap-2 text-lg shadow-lg transition-shadow hover:shadow-xl sm:w-auto"
              onClick={() => router.push('/')}
            >
              <ArrowLeft weight="bold" size={22} />
              Înapoi acasă
            </Button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-white/20 bg-white/10 text-lg text-white hover:bg-white/20 sm:w-auto"
              >
                <WhatsappLogo weight="fill" size={22} />
                Scrie-ne pe WhatsApp
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 text-sm text-white/60"
          >
            Sau mergi la{' '}
            <Link href="/contact" className="text-white underline-offset-4 hover:text-accent hover:underline">
              contact
            </Link>
            ,{' '}
            <Link href="/servicii" className="text-white underline-offset-4 hover:text-accent hover:underline">
              servicii
            </Link>{' '}
            sau{' '}
            <Link href="/portofoliu" className="text-white underline-offset-4 hover:text-accent hover:underline">
              portofoliu
            </Link>
            .
          </motion.p>
        </div>
      </div>
    </section>
  )
}
