import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, isAdmin, isAuthenticated } from '@/lib/access'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'featured', '_status', 'publishedAt', 'updatedAt'],
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
        description: 'ID numeric vechi pentru redirecturi (/blog/1 → slug)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'legacyCoverImageUrl',
      type: 'text',
      admin: {
        description: 'Fallback temporar pentru imagini externe la seed',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Conținut (Lexical)',
    },
    {
      name: 'legacyMarkdown',
      type: 'textarea',
      label: 'Markdown legacy',
      admin: {
        description: 'Articole importate din data.ts — randate ca fallback dacă body lipsește',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'readTime',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Ghiduri', value: 'guides' },
        { label: 'Sfaturi', value: 'tips' },
        { label: 'Daune RCA/CASCO', value: 'insurance' },
        { label: 'Întreținere', value: 'maintenance' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
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
}
