import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isAdmin, isAdminFieldLevel, isAuthenticated } from '@/lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const ContactAttachments: CollectionConfig = {
  slug: 'contact-attachments',
  labels: {
    singular: 'Atașament contact',
    plural: 'Atașamente contact',
  },
  admin: {
    useAsTitle: 'originalFilename',
    defaultColumns: ['originalFilename', 'mimeType', 'sizeBytes', 'uploadedAt', 'updatedAt'],
    description: 'Fotografii private din formularul de contact. Nu sunt publice.',
  },
  access: {
    read: isAuthenticated,
    create: () => false,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'contactRequest',
      type: 'relationship',
      relationTo: 'contact-requests',
      index: true,
    },
    {
      name: 'originalFilename',
      type: 'text',
      access: {
        read: isAdminFieldLevel,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sizeBytes',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'width',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'height',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'uploadedAt',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'retentionUntil',
      type: 'date',
      admin: {
        description: 'Dată estimată pentru ștergere conform politicii de retenție.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../private/contact-attachments'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
        withoutEnlargement: true,
      },
    ],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 82,
      },
    },
  },
}
