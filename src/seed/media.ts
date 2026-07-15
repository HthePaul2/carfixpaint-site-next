import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export const PROJECT_ROOT = path.resolve(dirname, '../..')

export type MediaCategory = 'blog' | 'portfolio-before' | 'portfolio-after' | 'general'

type UpsertMediaInput = {
  absolutePath: string
  alt: string
  category?: MediaCategory
}

export function publicAssetPath(...segments: string[]) {
  return path.join(PROJECT_ROOT, 'public', ...segments)
}

/** Upsert a Media doc by filename so re-seeding stays idempotent. */
export async function upsertMedia(
  payload: Payload,
  { absolutePath, alt, category = 'general' }: UpsertMediaInput,
) {
  const mediaFilename = path.basename(absolutePath)

  const existing = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: mediaFilename,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const doc = existing.docs[0]

  if (doc) {
    return payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        alt,
        category,
      },
      filePath: absolutePath,
      overwriteExistingFiles: true,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'media',
    data: {
      alt,
      category,
    },
    filePath: absolutePath,
    overrideAccess: true,
  })
}
