import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, publicReadApprovedReviews } from '@/lib/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'rating',
      'source',
      'verified',
      'approved',
      'featured',
      'date',
      'updatedAt',
    ],
  },
  access: {
    read: publicReadApprovedReviews,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const current = {
          ...(originalDoc ?? {}),
          ...data,
        } as Record<string, unknown>

        const approved = Boolean(current.approved)
        const verified = Boolean(current.verified)
        const source = typeof current.source === 'string' ? current.source : undefined
        const sourceUrl =
          typeof current.sourceUrl === 'string' ? current.sourceUrl.trim() : undefined
        const consentConfirmed = Boolean(current.consentConfirmed)
        const text = typeof current.text === 'string' ? current.text.trim() : ''

        if (Object.prototype.hasOwnProperty.call(data, 'text') || data.hasComment === undefined) {
          data.hasComment = text.length > 0
          if (Object.prototype.hasOwnProperty.call(data, 'text')) {
            data.text = text || null
          }
        }

        if (approved && !verified) {
          throw new Error('O recenzie poate fi publicată doar după verificarea sursei.')
        }

        if (verified && !source) {
          throw new Error('Selectează sursa recenziei înainte de verificare.')
        }

        if (verified && source === 'direct' && !consentConfirmed) {
          throw new Error(
            'Pentru feedback primit direct trebuie confirmat acordul clientului pentru publicare.',
          )
        }

        if (verified && source !== 'direct' && !sourceUrl) {
          throw new Error('Adaugă URL-ul public al recenziei înainte de verificare.')
        }

        if (data.verified === false) {
          data.approved = false
          data.verifiedAt = null
        } else if (verified && !current.verifiedAt) {
          data.verifiedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'seedKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Cheie stabilă pentru seed idempotent',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description:
          'Folosește numele public din sursă sau inițiale dacă persoana a cerut anonimizarea.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'text',
      type: 'textarea',
      admin: {
        description:
          'Lasă gol dacă evaluarea nu are comentariu public. Nu inventa un testimonial.',
      },
    },
    {
      name: 'hasComment',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Bifat automat când există text real; folosit pentru filtre și sortare.',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'serviceLabel',
      type: 'text',
      admin: {
        description: 'Etichetă liberă dacă relationship-ul lipsește (ex. la seed)',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Google Business Profile', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Feedback primit direct', value: 'direct' },
        { label: 'Altă sursă publică', value: 'other' },
      ],
      admin: {
        description: 'Locul din care poate fi verificat feedbackul.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'URL sursă',
      admin: {
        description:
          'Obligatoriu pentru Google, Facebook sau altă sursă publică. Poate fi linkul profilului dacă nu există link direct către recenzie.',
      },
    },
    {
      name: 'consentConfirmed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Acord pentru publicare confirmat',
      admin: {
        description:
          'Bifează doar pentru feedback primit direct, după ce clientul a acceptat publicarea.',
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sursă verificată',
      admin: {
        description:
          'Confirmă că ratingul, autorul și textul corespund unei surse reale sau feedbackului autorizat.',
      },
    },
    {
      name: 'verifiedAt',
      type: 'date',
      label: 'Data verificării',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Devine publică numai dacă este bifată și „Sursă verificată”.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
