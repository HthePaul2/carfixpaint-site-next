'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WhatsappLogo, List, X } from '@phosphor-icons/react'

import { BrandLogo } from '@/components/layout/BrandLogo'
import { Button } from '@/components/ui/button'
import type { SiteInfoView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function Header({ company }: { company: SiteInfoView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = company.navigationItems.filter((item) => item.path !== '/')
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-3">
          <BrandLogo height={36} priority />

          <nav className="hidden items-center gap-4 xl:flex 2xl:gap-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-accent ${
                  isActive(item.path) ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button className="gap-2">
                <WhatsappLogo weight="fill" size={18} />
                <span className="hidden 2xl:inline">{company.phone}</span>
                <span className="2xl:hidden">WhatsApp</span>
              </Button>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden"
              aria-label={mobileMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={28} weight="bold" />
              ) : (
                <List size={28} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="border-b border-border bg-background xl:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {company.navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent ${
                  isActive(item.path) ? 'bg-secondary text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pt-3 md:hidden"
            >
              <Button className="w-full gap-2">
                <WhatsappLogo weight="fill" size={18} />
                WhatsApp — {company.phone}
              </Button>
            </a>
          </nav>
        </div>
      ) : null}
    </>
  )
}
