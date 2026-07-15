import type { HomepageView, LegalPagesView, SiteInfoView, StaticPagesView } from '@/lib/cms-types'
import {
  HOMEPAGE_CONTENT,
  LEGAL_PAGES_CONTENT,
  SITE_SETTINGS,
  STATIC_PAGES_CONTENT,
} from '@/seed/content'

export const defaultSiteInfo: SiteInfoView = {
  name: SITE_SETTINGS.companyName,
  tagline: SITE_SETTINGS.tagline,
  phone: SITE_SETTINGS.phone,
  email: SITE_SETTINGS.email,
  address: SITE_SETTINGS.address,
  schedule: SITE_SETTINGS.schedule,
  whatsappNumber: SITE_SETTINGS.whatsappNumber,
  whatsappMessage: SITE_SETTINGS.whatsappMessage,
  logoAbbreviation: SITE_SETTINGS.logoAbbreviation,
  footerDescription: SITE_SETTINGS.footerDescription,
  footerServices: SITE_SETTINGS.footerServices,
  navigationItems: SITE_SETTINGS.navigationItems,
  copyrightText: SITE_SETTINGS.copyrightText,
}

export const defaultHomepage: HomepageView = HOMEPAGE_CONTENT

export const defaultStaticPages: StaticPagesView = STATIC_PAGES_CONTENT

export const defaultLegalPages: LegalPagesView = {
  privacyTitle: LEGAL_PAGES_CONTENT.privacyTitle,
  privacyContent: null,
  privacySeoTitle: LEGAL_PAGES_CONTENT.privacySeoTitle,
  privacySeoDescription: LEGAL_PAGES_CONTENT.privacySeoDescription,
  privacySeoKeywords: 'politică de confidențialitate, date personale, GDPR, CarFix Paint',
  cookiesTitle: LEGAL_PAGES_CONTENT.cookiesTitle,
  cookiesContent: null,
  cookiesSeoTitle: LEGAL_PAGES_CONTENT.cookiesSeoTitle,
  cookiesSeoDescription: LEGAL_PAGES_CONTENT.cookiesSeoDescription,
  cookiesSeoKeywords: 'politică cookies, module cookie, CarFix Paint',
  termsTitle: LEGAL_PAGES_CONTENT.termsTitle,
  termsContent: null,
  termsSeoTitle: LEGAL_PAGES_CONTENT.termsSeoTitle,
  termsSeoDescription: LEGAL_PAGES_CONTENT.termsSeoDescription,
  termsSeoKeywords: 'termeni și condiții, service auto, CarFix Paint',
}
