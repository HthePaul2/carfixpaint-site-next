import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAuthenticated } from '@/lib/access'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: {
    singular: 'Programare',
    plural: 'Programări',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'requestedStart',
      'name',
      'phone',
      'service',
      'status',
      'submittedAt',
    ],
  },
  access: {
    create: () => false,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        const nextStatus = data.status ?? originalDoc?.status
        const previousStatus = originalDoc?.status
        const slotKey = data.slotKey ?? originalDoc?.slotKey

        if (
          operation === 'update' &&
          slotKey &&
          previousStatus &&
          ['pending', 'confirmed', 'reschedule-proposed'].includes(String(previousStatus)) &&
          ['cancelled', 'rejected', 'completed', 'no-show'].includes(String(nextStatus))
        ) {
          data.slotKey = `${slotKey}#released-${originalDoc?.id ?? Date.now()}`
          if (!data.cancelledAt && ['cancelled', 'rejected'].includes(String(nextStatus))) {
            data.cancelledAt = new Date().toISOString()
          }
        }

        return data
      },
    ],
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
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'carBrand',
      type: 'text',
    },
    {
      name: 'carModel',
      type: 'text',
    },
    {
      name: 'licensePlate',
      type: 'text',
    },
    {
      name: 'requestedStart',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'requestedEnd',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Europe/Bucharest',
      required: true,
    },
    {
      name: 'slotKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Cheie unică pentru sloturile care blochează calendarul (pending/confirmed).',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'În așteptare', value: 'pending' },
        { label: 'Confirmată', value: 'confirmed' },
        { label: 'Reprogramare propusă', value: 'reschedule-proposed' },
        { label: 'Anulată', value: 'cancelled' },
        { label: 'Respinsă', value: 'rejected' },
        { label: 'Finalizată', value: 'completed' },
        { label: 'Neprezentare', value: 'no-show' },
      ],
    },
    {
      name: 'customerMessage',
      type: 'textarea',
    },
    {
      name: 'adminNotes',
      type: 'textarea',
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'contact-attachments',
      hasMany: true,
      label: 'Fotografii din formular',
      admin: {
        readOnly: true,
        description:
          'Fotografii încărcate de client pe /programare. Nu selecta manual poze din cereri de contact.',
      },
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
      name: 'confirmedAt',
      type: 'date',
    },
    {
      name: 'cancelledAt',
      type: 'date',
    },
    {
      name: 'cancellationReason',
      type: 'text',
    },
    {
      name: 'cancelTokenHash',
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
