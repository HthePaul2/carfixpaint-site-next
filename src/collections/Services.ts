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
    defaultColumns: ['name', 'slug', 'active', 'featured', 'order', 'updatedAt'],
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
    {
      name: 'seoTitle',
      type: 'text',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
  ],
}
