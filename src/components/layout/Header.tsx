'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const company = useSiteSettings()
  const navItems = company.navigationItems

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">{company.logoAbbreviation}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">{company.name}</span>
              <span className="text-xs text-muted-foreground">{company.tagline}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(item.path) ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hidden md:block">
              <Button className="gap-2">
                <Phone weight="bold" size={18} />
                {company.phone}
              </Button>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-accent ${
                    isActive(item.path) ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="pt-2">
                <Button className="w-full gap-2">
                  <Phone weight="bold" size={18} />
                  {company.phone}
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
