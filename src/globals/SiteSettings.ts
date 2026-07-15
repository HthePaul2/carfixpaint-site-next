import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Setări site',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
      defaultValue: 'CarFix Paint',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Service Auto Premium Brașov',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      admin: {
        description: 'Format internațional fără +, ex: 40760686384',
      },
    },
    {
      name: 'whatsappMessage',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'schedule',
      type: 'text',
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'facebook',
      type: 'text',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'canonicalDomain',
      type: 'text',
      admin: {
        description: 'Ex: https://carfixpaint.ro',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine Open Graph implicită (og:image)',
      admin: {
        description:
          'Imagine folosită la share pe rețele sociale când o pagină nu are imagine OG proprie.',
      },
    },
    {
      name: 'ctaPhoneLabel',
      type: 'text',
      defaultValue: 'Sună Acum',
    },
    {
      name: 'ctaQuoteLabel',
      type: 'text',
      defaultValue: 'Cere Ofertă Gratuită',
    },
    {
      name: 'logoAbbreviation',
      type: 'text',
      defaultValue: 'CF',
      admin: {
        description: 'Inițiale afișate în logo',
      },
    },
    {
      name: 'footerDescription',
      type: 'textarea',
      defaultValue:
        'Service auto multimarcă în Brașov. Tinichigerie, vopsitorie profesională și gestionare daune RCA/CASCO.',
    },
    {
      name: 'footerServices',
      type: 'array',
      label: 'Servicii în footer',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'navigationItems',
      type: 'array',
      label: 'Meniu navigare',
      fields: [
        { name: 'path', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2026 CarFix Paint. Toate drepturile rezervate.',
    },
  ],
}
