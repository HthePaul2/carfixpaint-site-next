import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'
import { phosphorIconOptions } from '@/globals/fields/icon-options'
import { seoFields } from '@/globals/fields/seo-fields'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Pagina principală',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroBadge',
              type: 'text',
              defaultValue: 'Service Auto Premium Brașov',
            },
            {
              name: 'heroTitle',
              type: 'text',
              defaultValue: 'Reparații Auto Profesionale',
            },
            {
              name: 'heroAccentText',
              type: 'text',
              defaultValue: 'Cu Decontare Directă',
            },
            {
              name: 'heroDescription',
              type: 'textarea',
            },
            {
              name: 'heroCtaPhoneLabel',
              type: 'text',
              defaultValue: 'Sună Acum',
            },
            {
              name: 'heroCtaQuoteLabel',
              type: 'text',
              defaultValue: 'Cere Ofertă Gratuită',
            },
          ],
        },
        {
          label: 'Beneficii',
          fields: [
            {
              name: 'benefits',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  options: phosphorIconOptions,
                  required: true,
                },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Secțiuni',
          fields: [
            {
              name: 'servicesSectionTitle',
              type: 'text',
              defaultValue: 'Serviciile Noastre',
            },
            {
              name: 'servicesSectionSubtitle',
              type: 'textarea',
            },
            {
              name: 'portfolioSectionTitle',
              type: 'text',
              defaultValue: 'Portofoliu Lucrări',
            },
            {
              name: 'reviewsSectionTitle',
              type: 'text',
              defaultValue: 'Ce Spun Clienții Noștri',
            },
            {
              name: 'servicesLimit',
              type: 'number',
              defaultValue: 6,
              min: 1,
              max: 24,
            },
            {
              name: 'portfolioLimit',
              type: 'number',
              defaultValue: 3,
              min: 1,
              max: 12,
            },
            {
              name: 'reviewsLimit',
              type: 'number',
              defaultValue: 6,
              min: 1,
              max: 24,
            },
          ],
        },
        {
          label: 'Proces daune',
          fields: [
            {
              name: 'damageProcessTitle',
              type: 'text',
              defaultValue: 'Cum Funcționează Procesul de Daune',
            },
            {
              name: 'damageProcessSteps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'CTA final',
          fields: [
            {
              name: 'finalCtaTitle',
              type: 'text',
              defaultValue: 'Ai Nevoie de Reparații Auto?',
            },
            {
              name: 'finalCtaDescription',
              type: 'textarea',
            },
            {
              name: 'finalCtaButtonLabel',
              type: 'text',
              defaultValue: 'Contactează-ne Acum',
            },
          ],
        },
        {
          label: 'SEO',
          fields: seoFields(),
        },
      ],
    },
  ],
}
