import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, isAdmin, isAuthenticated } from '@/lib/access'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured', '_status', 'publishedAt', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: authenticatedOrPublished,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
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
      name: 'legacyId',
      type: 'text',
      admin: {
        description: 'ID numeric vechi pentru redirecturi (/portofoliu/1 → slug)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'legacyBeforeImageUrl',
      type: 'text',
      admin: {
        description: 'Fallback temporar pentru imagini externe la seed',
      },
    },
    {
      name: 'legacyAfterImageUrl',
      type: 'text',
      admin: {
        description: 'Fallback temporar pentru imagini externe la seed',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'duration',
      type: 'text',
    },
    {
      name: 'vehicleBrand',
      type: 'text',
    },
    {
      name: 'vehicleModel',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
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
