import type { CollectionSlug, Payload } from 'payload'

type UpsertOptions = {
  draft?: boolean
}

export async function upsertBySlug(
  payload: Payload,
  collection: CollectionSlug,
  slug: string,
  data: Record<string, unknown>,
  options?: UpsertOptions,
) {
  const existing = await payload.find({
    collection,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    overrideAccess: true,
  })

  const doc = existing.docs[0]
  const draftOptions =
    typeof options?.draft === 'boolean' ? ({ draft: options.draft } as const) : {}

  if (doc) {
    return payload.update({
      collection,
      id: doc.id,
      data: data as never,
      overrideAccess: true,
      ...draftOptions,
    })
  }

  return payload.create({
    collection,
    data: {
      slug,
      ...data,
    } as never,
    overrideAccess: true,
    ...draftOptions,
  })
}

export async function upsertByField(
  payload: Payload,
  collection: CollectionSlug,
  field: string,
  value: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    },
    limit: 1,
    overrideAccess: true,
  })

  const doc = existing.docs[0]

  if (doc) {
    return payload.update({
      collection,
      id: doc.id,
      data: data as never,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
  })
}

export async function upsertGlobal(
  payload: Payload,
  slug: 'site-settings' | 'homepage' | 'legal-pages' | 'static-pages' | 'availability-settings',
  data: Record<string, unknown>,
) {
  return payload.updateGlobal({
    slug,
    data: data as never,
    overrideAccess: true,
  })
}
