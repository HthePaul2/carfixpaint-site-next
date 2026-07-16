import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated } from '@/lib/access'

const serviceIconOptions = [
  { label: 'Hammer', value: 'Hammer' },
  { label: 'Paint Brush', value: 'PaintBrush' },
  { label: 'Wrench', value: 'Wrench' },
  { label: 'Computer Tower', value: 'ComputerTower' },
  { label: 'Shield', value: 'Shield' },
  { label: 'Car', value: 'Car' },
  { label: 'Lightning', value: 'Lightning' },
  { label: 'Check Circle', value: 'CheckCircle' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Clock', value: 'Clock' },
]

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pageSlug', 'slug', 'active', 'featured', 'order', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { active: { equals: true } }
    },
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Identificator intern (relații, seed). Nu se schimbă după publicare.',
      },
    },
    {
      name: 'pageSlug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Slug public pentru URL /servicii/{pageSlug}',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: serviceIconOptions,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Pagină serviciu',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
            },
            {
              name: 'intro',
              type: 'textarea',
            },
            {
              name: 'whenNeededTitle',
              type: 'text',
              defaultValue: 'Când este recomandat acest serviciu',
            },
            {
              name: 'whenNeededItems',
              type: 'array',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'processTitle',
              type: 'text',
              defaultValue: 'Cum lucrăm',
            },
            {
              name: 'processSteps',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
            {
              name: 'ctaTitle',
              type: 'text',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
            },
            {
              name: 'ctaPrimaryLabel',
              type: 'text',
              defaultValue: 'Trimite poze pentru evaluare',
            },
            {
              name: 'ctaSecondaryLabel',
              type: 'text',
              defaultValue: 'Solicită o programare',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'active',
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
