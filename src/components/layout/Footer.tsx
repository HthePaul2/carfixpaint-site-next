'use client'

import Link from 'next/link'
import { Phone, EnvelopeSimple, MapPin, Clock, FacebookLogo, InstagramLogo } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'

export function Footer() {
  const company = useSiteSettings()
  const navItems = company.navigationItems.filter((item) => item.path !== '/')

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">{company.logoAbbreviation}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">{company.name}</span>
                <span className="text-xs opacity-80">{company.tagline}</span>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">{company.footerDescription}</p>
            <div className="flex gap-3">
              {company.facebook ? (
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <FacebookLogo size={20} weight="fill" />
                </a>
              ) : null}
              {company.instagram ? (
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <InstagramLogo size={20} weight="fill" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Navigare</h3>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="opacity-80 hover:opacity-100 hover:text-accent transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Servicii</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {company.footerServices.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} weight="bold" className="mt-0.5 flex-shrink-0" />
                <span className="opacity-80">{company.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-accent transition-all"
                >
                  <Phone size={18} weight="bold" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 hover:text-accent transition-all"
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={18} weight="bold" className="mt-0.5 flex-shrink-0" />
                <span className="opacity-80">{company.schedule}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <p>{company.copyrightText}</p>
          <div className="flex gap-6">
            <Link
              href="/politica-confidentialitate"
              className="hover:opacity-100 hover:text-accent transition-all"
            >
              Politică de Confidențialitate
            </Link>
            <Link
              href="/politica-cookies"
              className="hover:opacity-100 hover:text-accent transition-all"
            >
              Politică Cookies
            </Link>
            <Link
              href="/termeni-conditii"
              className="hover:opacity-100 hover:text-accent transition-all"
            >
              Termeni și Condiții
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
