import type { Field } from 'payload'

export function seoFields(): Field[] {
  return [
    {
      name: 'seoTitle',
      type: 'text',
      label: 'Titlu SEO',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'Descriere SEO',
    },
    {
      name: 'seoKeywords',
      type: 'text',
      label: 'Cuvinte cheie',
    },
    {
      name: 'ogTitle',
      type: 'text',
      label: 'Titlu Open Graph',
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      label: 'Descriere Open Graph',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine Open Graph (og:image)',
      admin: {
        description:
          'Imagine afișată la share pe rețele sociale. Dacă e goală, se folosește imaginea implicită din Setări site.',
      },
    },
  ]
}
