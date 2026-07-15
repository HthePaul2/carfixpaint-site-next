import type { Payload, CollectionSlug } from 'payload'

type UpsertOptions = {
  draft?: false
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
  const publishOptions = options?.draft === false ? ({ draft: false } as const) : {}

  if (doc) {
    return payload.update({
      collection,
      id: doc.id,
      data: data as never,
      overrideAccess: true,
      ...publishOptions,
    })
  }

  return payload.create({
    collection,
    data: {
      slug,
      ...data,
    } as never,
    overrideAccess: true,
    ...publishOptions,
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
  slug: 'site-settings' | 'homepage' | 'legal-pages' | 'static-pages',
  data: Record<string, unknown>,
) {
  return payload.updateGlobal({
    slug,
    data: data as never,
    overrideAccess: true,
  })
}
