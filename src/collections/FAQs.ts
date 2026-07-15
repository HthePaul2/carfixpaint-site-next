import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, publicReadPublishedFaqs } from '@/lib/access'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'published', 'order', 'updatedAt'],
  },
  access: {
    read: publicReadPublishedFaqs,
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
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Servicii', value: 'services' },
        { label: 'Daune', value: 'insurance' },
        { label: 'Prețuri', value: 'pricing' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
