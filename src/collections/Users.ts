import type { Access, CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '@/lib/access'

const firstUserOrAdmin: Access = async ({ req }) => {
  if (req.user) return req.user.role === 'admin'

  const existingUsers = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  return existingUsers.totalDocs === 0
}

const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: adminOrSelf,
    create: firstUserOrAdmin,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const existingUsers = await req.payload.find({
          collection: 'users',
          depth: 0,
          limit: 1,
          overrideAccess: true,
        })

        if (existingUsers.totalDocs === 0) {
          return {
            ...data,
            role: 'admin',
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
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}
