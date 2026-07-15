import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, publicReadApprovedReviews } from '@/lib/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'approved', 'featured', 'date', 'updatedAt'],
  },
  access: {
    read: publicReadApprovedReviews,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
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
      required: true,
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
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
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
