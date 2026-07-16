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
        if (operation !== 'update') return data

        const previousStatus = originalDoc?.status ? String(originalDoc.status) : undefined
        const nextStatus = String(data.status ?? previousStatus ?? '')
        const statusChanged = Boolean(previousStatus && data.status && previousStatus !== nextStatus)
        const now = new Date().toISOString()
        const slotKey = data.slotKey ?? originalDoc?.slotKey
        const blocking = ['pending', 'confirmed', 'reschedule-proposed']
        const releasing = ['cancelled', 'rejected', 'completed', 'no-show']

        if (statusChanged && nextStatus === 'confirmed') {
          data.confirmedAt = data.confirmedAt ?? originalDoc?.confirmedAt ?? now
        }

        if (statusChanged && (nextStatus === 'cancelled' || nextStatus === 'rejected')) {
          data.cancelledAt = data.cancelledAt ?? originalDoc?.cancelledAt ?? now
          const existingReason =
            (typeof data.cancellationReason === 'string' && data.cancellationReason.trim()) ||
            (typeof originalDoc?.cancellationReason === 'string' &&
              originalDoc.cancellationReason.trim()) ||
            ''
          if (!existingReason) {
            data.cancellationReason =
              nextStatus === 'rejected' ? 'Respinsă din admin' : 'Anulată din admin'
          }
        }

        if (
          statusChanged &&
          slotKey &&
          previousStatus &&
          blocking.includes(previousStatus) &&
          releasing.includes(nextStatus) &&
          !String(slotKey).includes('#released-')
        ) {
          data.slotKey = `${slotKey}#released-${originalDoc?.id ?? Date.now()}`
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
      type: 'upload',
      relationTo: 'contact-attachments',
      hasMany: true,
      label: 'Fotografii din formular',
      admin: {
        readOnly: true,
        description:
          'Fotografii încărcate de client pe /programare. Deschide fișierul pentru preview.',
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
      admin: {
        readOnly: true,
        description: 'Se completează automat când statusul trece în „Confirmată”.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancelledAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Se completează automat când statusul trece în „Anulată” sau „Respinsă”.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancellationReason',
      type: 'text',
      admin: {
        description:
          'Opțional. Dacă lași gol la anulare/respingere, se completează automat („Anulată din admin” / „Respinsă din admin”).',
      },
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
