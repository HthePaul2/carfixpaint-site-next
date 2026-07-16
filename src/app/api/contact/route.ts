import { NextResponse } from 'next/server'

import { sendContactNotification } from '@/lib/contact-email'
import {
  CONTACT_PHOTO_MAX_FILES,
  CONTACT_PHOTO_MAX_TOTAL_BYTES,
  processContactPhoto,
  retentionUntilFromNow,
} from '@/lib/contact-photos'
import { getPayloadClient } from '@/lib/payload'
import { contactSchema, normalizeContactInput } from '@/lib/validation'

const MAX_JSON_REQUEST_BYTES = 16 * 1024
const MAX_MULTIPART_BYTES = 25 * 1024 * 1024
const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const SERVICE_LABELS: Record<string, string> = {
  tinichigerie: 'Tinichigerie & Caroserie',
  vopsitorie: 'Vopsitorie',
  mecanica: 'Mecanică Auto',
  diagnoza: 'Diagnoză Computerizată',
  daune: 'Daune RCA/CASCO',
  'daune-rca-casco': 'Daune RCA/CASCO',
  'masina-schimb': 'Mașină la schimb',
  altele: 'Altele',
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function formDataToObject(formData: FormData): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === 'photos') continue
    if (typeof value === 'string') body[key] = value
  }
  if (body.gdprConsent === 'true' || body.gdprConsent === 'on') body.gdprConsent = true
  return body
}

async function parseRequest(request: Request): Promise<{
  fields: unknown
  photoFiles: File[]
}> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (contentLength > MAX_MULTIPART_BYTES) {
      throw new Error('request_too_large')
    }

    const formData = await request.formData()
    const photoFiles = formData
      .getAll('photos')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    return {
      fields: formDataToObject(formData),
      photoFiles,
    }
  }

  const rawBody = await request.text()
  const bodySize = new TextEncoder().encode(rawBody).byteLength
  if (bodySize > MAX_JSON_REQUEST_BYTES) {
    throw new Error('request_too_large')
  }

  try {
    return {
      fields: JSON.parse(rawBody) as unknown,
      photoFiles: [],
    }
  } catch {
    throw new Error('invalid_json')
  }
}

export async function POST(request: Request) {
  const createdAttachmentIds: number[] = []
  let createdRequestId: number | undefined

  try {
    let fields: unknown
    let photoFiles: File[]

    try {
      ;({ fields, photoFiles } = await parseRequest(request))
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid_json'
      return NextResponse.json(
        {
          success: false,
          message:
            reason === 'request_too_large'
              ? 'Cererea trimisă este prea mare.'
              : 'Datele trimise nu sunt valide.',
        },
        { status: reason === 'request_too_large' ? 413 : 400 },
      )
    }

    if (photoFiles.length > CONTACT_PHOTO_MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message: `Poți încărca maximum ${CONTACT_PHOTO_MAX_FILES} fotografii.`,
        },
        { status: 400 },
      )
    }

    const totalPhotoBytes = photoFiles.reduce((sum, file) => sum + file.size, 0)
    if (totalPhotoBytes > CONTACT_PHOTO_MAX_TOTAL_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dimensiunea totală a fotografiilor depășește 20 MB.',
        },
        { status: 400 },
      )
    }

    const parsed = contactSchema.safeParse(fields)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Datele trimise nu sunt valide.' },
        { status: 400 },
      )
    }

    if (parsed.data.company) {
      return NextResponse.json({
        success: true,
        message: 'Cererea a fost înregistrată.',
      })
    }

    const data = normalizeContactInput(parsed.data)
    const payload = await getPayloadClient()
    const clientIp = getClientIp(request)

    if (clientIp !== 'unknown') {
      const submittedAfter = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
      const recentRequests = await payload.find({
        collection: 'contact-requests',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          and: [
            { ip: { equals: clientIp } },
            { submittedAt: { greater_than: submittedAfter } },
          ],
        },
      })

      if (recentRequests.totalDocs >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ai trimis prea multe cereri. Încearcă din nou peste câteva minute.',
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
            },
          },
        )
      }
    }

    let processedPhotos
    try {
      processedPhotos = await Promise.all(photoFiles.map((file) => processContactPhoto(file)))
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid_image'
      const message =
        reason === 'file_too_large'
          ? 'Fiecare fotografie poate avea maximum 5 MB.'
          : 'Una dintre fotografii nu este un JPG, PNG sau WebP valid.'
      return NextResponse.json({ success: false, message }, { status: 400 })
    }

    let serviceId: number | undefined
    let serviceLabel = SERVICE_LABELS[data.serviceType] ?? data.serviceType

    if (data.serviceType !== 'altele') {
      const serviceResult = await payload.find({
        collection: 'services',
        where: { slug: { equals: data.serviceType } },
        limit: 1,
        overrideAccess: true,
      })
      const serviceDoc = serviceResult.docs[0]
      if (serviceDoc) {
        serviceId = serviceDoc.id
        serviceLabel = serviceDoc.name
      }
    }

    const created = await payload.create({
      collection: 'contact-requests',
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        carBrand: data.carBrand,
        licensePlate: data.licensePlate,
        service: serviceId,
        serviceType: serviceLabel,
        message: data.message,
        gdprConsent: true,
        status: 'new',
        source: 'website',
        submittedAt: new Date().toISOString(),
        ip: clientIp,
        userAgent: request.headers.get('user-agent') ?? '',
        photoCount: 0,
      },
      overrideAccess: true,
    })
    createdRequestId = created.id as number

    for (const photo of processedPhotos) {
      const attachment = await payload.create({
        collection: 'contact-attachments',
        data: {
          contactRequest: createdRequestId,
          originalFilename: photo.originalFilename,
          mimeType: photo.mimeType,
          sizeBytes: photo.sizeBytes,
          width: photo.width,
          height: photo.height,
          uploadedAt: new Date().toISOString(),
          retentionUntil: retentionUntilFromNow(180),
        },
        file: {
          data: photo.buffer,
          mimetype: photo.mimeType,
          name: photo.filename,
          size: photo.sizeBytes,
        },
        overrideAccess: true,
      })
      createdAttachmentIds.push(attachment.id as number)
    }

    if (createdAttachmentIds.length) {
      await payload.update({
        collection: 'contact-requests',
        id: createdRequestId,
        data: {
          photos: createdAttachmentIds,
          photoCount: createdAttachmentIds.length,
        },
        overrideAccess: true,
      })
    }

    await sendContactNotification({
      requestId: createdRequestId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      serviceType: serviceLabel,
      message: data.message,
      photoCount: createdAttachmentIds.length,
    })

    return NextResponse.json({
      success: true,
      message:
        'Cererea și fotografiile au fost trimise. Revenim cât mai curând posibil în programul de lucru.',
    })
  } catch (error) {
    console.error('Contact form submission failed', error)

    try {
      const payload = await getPayloadClient()
      for (const id of createdAttachmentIds) {
        await payload.delete({
          collection: 'contact-attachments',
          id,
          overrideAccess: true,
        })
      }
      if (createdRequestId) {
        await payload.delete({
          collection: 'contact-requests',
          id: createdRequestId,
          overrideAccess: true,
        })
      }
    } catch (cleanupError) {
      console.error('Contact form cleanup failed', cleanupError)
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Nu am putut trimite cererea. Încearcă din nou sau sună-ne direct.',
      },
      { status: 500 },
    )
  }
}
