import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'
import { phosphorIconOptions } from '@/globals/fields/icon-options'
import { seoFields } from '@/globals/fields/seo-fields'

const pageHeaderFields = [
  {
    name: 'pageTitle',
    type: 'text' as const,
    label: 'Titlu pagină',
    required: true,
  },
  {
    name: 'pageSubtitle',
    type: 'textarea' as const,
    label: 'Subtitlu',
  },
]

export const StaticPages: GlobalConfig = {
  slug: 'static-pages',
  label: 'Pagini statice',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Servicii',
          fields: [
            {
              name: 'servicii',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'Programare',
          fields: [
            {
              name: 'programare',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'Daune',
          fields: [
            {
              name: 'daune',
              type: 'group',
              fields: [
                ...pageHeaderFields,
                {
                  name: 'highlights',
                  type: 'array',
                  label: 'Beneficii',
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
                {
                  name: 'processTitle',
                  type: 'text',
                  label: 'Titlu proces',
                },
                {
                  name: 'processSteps',
                  type: 'array',
                  label: 'Pași proces',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                  ],
                },
                {
                  name: 'ctaTitle',
                  type: 'text',
                  label: 'Titlu CTA',
                },
                {
                  name: 'ctaDescription',
                  type: 'textarea',
                  label: 'Descriere CTA',
                },
                {
                  name: 'ctaContactLabel',
                  type: 'text',
                  label: 'Buton contact',
                },
                ...seoFields(),
              ],
            },
          ],
        },
        {
          label: 'Portofoliu',
          fields: [
            {
              name: 'portofoliu',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'Despre',
          fields: [
            {
              name: 'despre',
              type: 'group',
              fields: [
                {
                  name: 'pageTitle',
                  type: 'text',
                  label: 'Titlu pagină',
                  required: true,
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  label: 'Introducere',
                },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Statistici',
                  fields: [
                    { name: 'value', type: 'text', required: true },
                    { name: 'label', type: 'text', required: true },
                  ],
                },
                {
                  name: 'whyTitle',
                  type: 'text',
                  label: 'Titlu secțiune avantaje',
                },
                {
                  name: 'whyItems',
                  type: 'array',
                  label: 'Avantaje',
                  fields: [{ name: 'item', type: 'text', required: true }],
                },
                {
                  name: 'missionTitle',
                  type: 'text',
                  label: 'Titlu misiune',
                },
                {
                  name: 'missionText',
                  type: 'textarea',
                  label: 'Text misiune',
                },
                {
                  name: 'valuesTitle',
                  type: 'text',
                  label: 'Titlu valori',
                },
                {
                  name: 'valuesContent',
                  type: 'richText',
                  label: 'Conținut valori',
                },
                ...seoFields(),
              ],
            },
          ],
        },
        {
          label: 'Recenzii',
          fields: [
            {
              name: 'recenzii',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'Blog',
          fields: [
            {
              name: 'blog',
              type: 'group',
              fields: [...pageHeaderFields, ...seoFields()],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                ...pageHeaderFields,
                {
                  name: 'contactCardTitle',
                  type: 'text',
                  label: 'Titlu card contact',
                },
                {
                  name: 'fastResponseTitle',
                  type: 'text',
                  label: 'Titlu răspuns rapid',
                },
                {
                  name: 'fastResponseText',
                  type: 'textarea',
                  label: 'Text răspuns rapid',
                },
                ...seoFields(),
              ],
            },
          ],
        },
      ],
    },
  ],
}
