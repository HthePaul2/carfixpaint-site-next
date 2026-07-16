'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CloseIcon, MenuIcon } from '@/components/icons/MenuIcons'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

type NavItem = { path: string; label: string }

export function MobileNav({
  items,
  whatsappHref,
  phone,
}: {
  items: NavItem[]
  whatsappHref: string
  phone: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
        aria-expanded={open}
      >
        {open ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background">
          <nav className="container flex flex-col gap-1 py-4">
            {items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
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
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 md:hidden"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon size={18} />
              WhatsApp — {phone}
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
