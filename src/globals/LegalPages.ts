import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'

export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
  label: 'Pagini legale',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Confidențialitate',
          fields: [
            {
              name: 'privacyTitle',
              type: 'text',
              defaultValue: 'Politică de Confidențialitate',
            },
            {
              name: 'privacyContent',
              type: 'richText',
            },
            {
              name: 'privacySeoTitle',
              type: 'text',
            },
            {
              name: 'privacySeoDescription',
              type: 'textarea',
            },
            {
              name: 'privacyOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine Open Graph (og:image)',
            },
          ],
        },
        {
          label: 'Cookies',
          fields: [
            {
              name: 'cookiesTitle',
              type: 'text',
              defaultValue: 'Politică Cookies',
            },
            {
              name: 'cookiesContent',
              type: 'richText',
            },
            {
              name: 'cookiesSeoTitle',
              type: 'text',
            },
            {
              name: 'cookiesSeoDescription',
              type: 'textarea',
            },
            {
              name: 'cookiesOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine Open Graph (og:image)',
            },
          ],
        },
        {
          label: 'Termeni',
          fields: [
            {
              name: 'termsTitle',
              type: 'text',
              defaultValue: 'Termeni și Condiții',
            },
            {
              name: 'termsContent',
              type: 'richText',
            },
            {
              name: 'termsSeoTitle',
              type: 'text',
            },
            {
              name: 'termsSeoDescription',
              type: 'textarea',
            },
            {
              name: 'termsOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine Open Graph (og:image)',
            },
          ],
        },
      ],
    },
  ],
}
