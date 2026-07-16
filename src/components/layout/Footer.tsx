import Link from 'next/link'
import { WhatsappLogo, EnvelopeSimple, MapPin, Clock, FacebookLogo, InstagramLogo } from '@phosphor-icons/react/ssr'

import { BrandLogo } from '@/components/layout/BrandLogo'
import { Separator } from '@/components/ui/separator'
import type { SiteInfoView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export function Footer({ company }: { company: SiteInfoView }) {
  const navItems = company.navigationItems.filter((item) => item.path !== '/')
  const whatsappHref = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <BrandLogo height={40} variant="onDark" />
            </div>
            <p className="mb-4 text-sm text-primary-foreground/90">{company.footerDescription}</p>
            <div className="flex gap-3">
              {company.facebook ? (
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
                  aria-label="Facebook"
                >
                  <FacebookLogo size={20} weight="fill" />
                </a>
              ) : null}
              {company.instagram ? (
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
                  aria-label="Instagram"
                >
                  <InstagramLogo size={20} weight="fill" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Navigare</h3>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-primary-foreground/90 transition-all hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Servicii</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/90">
              {company.footerServices.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} weight="bold" className="mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/90">{company.address}</span>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/90 transition-all hover:text-accent"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  WhatsApp — {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 text-primary-foreground/90 transition-all hover:text-accent"
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={18} weight="bold" className="mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/90">{company.schedule}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/90 md:flex-row">
          <p>{company.copyrightText}</p>
          <div className="flex gap-6">
            <Link href="/politica-confidentialitate" className="hover:text-accent">
              Politică de Confidențialitate
            </Link>
            <Link href="/politica-cookies" className="hover:text-accent">
              Politică Cookies
            </Link>
            <Link href="/termeni-conditii" className="hover:text-accent">
              Termeni și Condiții
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
