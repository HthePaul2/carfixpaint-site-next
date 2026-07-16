import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { BlogPosts } from './collections/BlogPosts'
import { Reviews } from './collections/Reviews'
import { FAQs } from './collections/FAQs'
import { ContactRequests } from './collections/ContactRequests'
import { ContactAttachments } from './collections/ContactAttachments'
import { SiteSettings } from './globals/SiteSettings'
import { Homepage } from './globals/Homepage'
import { LegalPages } from './globals/LegalPages'
import { StaticPages } from './globals/StaticPages'
import { getStoragePlugins } from './lib/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET is required in production')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Services,
    PortfolioProjects,
    BlogPosts,
    Reviews,
    FAQs,
    ContactRequests,
    ContactAttachments,
  ],
  globals: [SiteSettings, Homepage, StaticPages, LegalPages],
  plugins: [...getStoragePlugins()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  secret: process.env.PAYLOAD_SECRET ?? 'development-only-secret',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
