import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '@/lib/access'

const dayFields = (label: string) => [
  {
    name: 'enabled',
    type: 'checkbox' as const,
    defaultValue: true,
    label: `${label} deschis`,
  },
  {
    name: 'start',
    type: 'text' as const,
    defaultValue: '08:00',
    label: 'Început',
  },
  {
    name: 'end',
    type: 'text' as const,
    defaultValue: '17:00',
    label: 'Sfârșit',
  },
]

export const AvailabilitySettings: GlobalConfig = {
  slug: 'availability-settings',
  label: 'Disponibilitate programări',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Europe/Bucharest',
      required: true,
    },
    {
      name: 'slotDurationMinutes',
      type: 'number',
      defaultValue: 30,
      required: true,
      min: 15,
      max: 120,
    },
    {
      name: 'minNoticeHours',
      type: 'number',
      defaultValue: 2,
      required: true,
      min: 0,
    },
    {
      name: 'maxAdvanceDays',
      type: 'number',
      defaultValue: 60,
      required: true,
      min: 1,
      max: 180,
    },
    {
      name: 'capacityPerSlot',
      type: 'number',
      defaultValue: 1,
      required: true,
      min: 1,
      max: 10,
    },
    {
      name: 'breakStart',
      type: 'text',
      defaultValue: '12:00',
      label: 'Început pauză',
    },
    {
      name: 'breakEnd',
      type: 'text',
      defaultValue: '13:00',
      label: 'Sfârșit pauză',
    },
    {
      name: 'confirmationText',
      type: 'textarea',
      defaultValue:
        'Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei sau pentru a propune un interval alternativ.',
    },
    {
      name: 'notificationEmail',
      type: 'email',
      admin: {
        description: 'Opțional; dacă lipsește, se folosește CONTACT_NOTIFICATION_EMAIL.',
      },
    },
    {
      type: 'group',
      name: 'monday',
      label: 'Luni',
      fields: dayFields('Luni'),
    },
    {
      type: 'group',
      name: 'tuesday',
      label: 'Marți',
      fields: dayFields('Marți'),
    },
    {
      type: 'group',
      name: 'wednesday',
      label: 'Miercuri',
      fields: dayFields('Miercuri'),
    },
    {
      type: 'group',
      name: 'thursday',
      label: 'Joi',
      fields: dayFields('Joi'),
    },
    {
      type: 'group',
      name: 'friday',
      label: 'Vineri',
      fields: dayFields('Vineri'),
    },
    {
      type: 'group',
      name: 'saturday',
      label: 'Sâmbătă',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Sâmbătă deschis',
        },
        {
          name: 'start',
          type: 'text',
          defaultValue: '09:00',
        },
        {
          name: 'end',
          type: 'text',
          defaultValue: '13:00',
        },
      ],
    },
    {
      type: 'group',
      name: 'sunday',
      label: 'Duminică',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Duminică deschis',
        },
        {
          name: 'start',
          type: 'text',
          defaultValue: '09:00',
        },
        {
          name: 'end',
          type: 'text',
          defaultValue: '13:00',
        },
      ],
    },
    {
      name: 'blockedDates',
      type: 'array',
      labels: { singular: 'Zi blocată', plural: 'Zile blocate' },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'yyyy-MM-dd',
            },
          },
        },
        {
          name: 'reason',
          type: 'text',
        },
      ],
    },
  ],
}
