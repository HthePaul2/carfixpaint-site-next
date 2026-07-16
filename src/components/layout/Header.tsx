import Link from 'next/link'

import { BrandLogo } from '@/components/layout/BrandLogo'
import { MobileNav } from '@/components/layout/MobileNav'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import type { SiteInfoView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

/** Mostly Server Component — only MobileNav hydrates. */
export function Header({ company }: { company: SiteInfoView }) {
  const navItems = company.navigationItems.filter((item) => item.path !== '/')
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <BrandLogo height={36} priority />

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-accent"
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
            className="hidden h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 md:inline-flex"
          >
            <WhatsAppIcon size={18} />
            <span className="hidden 2xl:inline">{company.phone}</span>
            <span className="2xl:hidden">WhatsApp</span>
          </a>

          <MobileNav
            items={company.navigationItems}
            whatsappHref={whatsappHref}
            phone={company.phone}
          />
        </div>
      </div>
    </header>
  )
}
