import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isAdmin, isAdminFieldLevel, isAuthenticated } from '@/lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const ContactAttachments: CollectionConfig = {
  slug: 'contact-attachments',
  labels: {
    singular: 'Atașament privat',
    plural: 'Atașamente private',
  },
  admin: {
    useAsTitle: 'originalFilename',
    defaultColumns: [
      'filename',
      'originalFilename',
      'mimeType',
      'sizeBytes',
      'contactRequest',
      'appointment',
      'uploadedAt',
    ],
    description:
      'Fotografii private din formularele de contact și programare. Nu sunt publice pe site.',
    listSearchableFields: ['originalFilename', 'filename'],
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
      admin: {
        description: 'Completat pentru foto din formularul de contact.',
      },
    },
    {
      name: 'appointment',
      type: 'relationship',
      relationTo: 'appointments',
      index: true,
      admin: {
        description: 'Completat pentru foto din formularul de programare.',
      },
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
