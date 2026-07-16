import type { CollectionConfig } from 'payload'

import {
  contactRequestAdminDelete,
  contactRequestAuthenticatedRead,
  isAdminFieldLevel,
  isAuthenticated,
} from '@/lib/access'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'submittedAt', 'updatedAt'],
  },
  access: {
    create: () => false,
    read: contactRequestAuthenticatedRead,
    update: isAuthenticated,
    delete: contactRequestAdminDelete,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'carBrand',
      type: 'text',
    },
    {
      name: 'licensePlate',
      type: 'text',
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'serviceType',
      type: 'text',
      admin: {
        description: 'Tip serviciu (text liber dacă relationship lipsește)',
      },
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'contact-attachments',
      hasMany: true,
      admin: {
        description: 'Fotografii private atașate la cerere.',
      },
    },
    {
      name: 'photoCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Număr de fotografii (pentru listare rapidă).',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nou', value: 'new' },
        { label: 'Contactat', value: 'contacted' },
        { label: 'Programat', value: 'scheduled' },
        { label: 'Închis', value: 'closed' },
        { label: 'Spam', value: 'spam' },
      ],
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'ip',
      type: 'text',
      access: {
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      access: {
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        readOnly: true,
      },
    },
  ],
}
