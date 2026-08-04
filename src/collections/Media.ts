import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'Portfolio Before', value: 'portfolio-before' },
        { label: 'Portfolio After', value: 'portfolio-after' },
        { label: 'General', value: 'general' },
      ],
    },
  ],
  upload: {
    // Keep public uploads in a stable project-level directory so Payload
    // doesn't resolve them relative to `.next/standalone` in production.
    staticDir: process.env.PAYLOAD_MEDIA_DIR ?? path.resolve(dirname, '../../media'),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
}
