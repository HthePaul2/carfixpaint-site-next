import { NextResponse } from 'next/server'

import { sendAppointmentNotifications } from '@/lib/appointment-email'
import { appointmentRequestSchema, createCancelToken } from '@/lib/appointment-validation'
import {
  APPOINTMENT_TIMEZONE,
  BLOCKING_STATUSES,
  defaultAvailabilitySettings,
  listSlotsForDate,
  type AvailabilityConfig,
} from '@/lib/appointments'
import {
  CONTACT_PHOTO_MAX_FILES,
  CONTACT_PHOTO_MAX_TOTAL_BYTES,
  processContactPhoto,
  retentionUntilFromNow,
} from '@/lib/contact-photos'
import { getPayloadClient } from '@/lib/payload'

const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_MULTIPART_BYTES = 25 * 1024 * 1024

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

  return {
    fields: (await request.json()) as unknown,
    photoFiles: [],
  }
}

export async function POST(request: Request) {
  const createdAttachmentIds: number[] = []
  let createdAppointmentId: number | undefined

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

    const parsed = appointmentRequestSchema.safeParse(fields)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Datele trimise nu sunt valide.' },
        { status: 400 },
      )
    }

    if (parsed.data.company) {
      return NextResponse.json({
        success: true,
        message: 'Solicitarea a fost înregistrată.',
      })
    }

    const data = parsed.data
    const payload = await getPayloadClient()
    const clientIp = getClientIp(request)

    if (clientIp !== 'unknown') {
      const submittedAfter = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
      const recent = await payload.find({
        collection: 'appointments',
        where: {
          and: [{ ip: { equals: clientIp } }, { submittedAt: { greater_than: submittedAfter } }],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (recent.totalDocs >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ai trimis prea multe solicitări. Încearcă din nou peste câteva minute.',
          },
          { status: 429 },
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

    const serviceResult = await payload.find({
      collection: 'services',
      where: {
        and: [{ slug: { equals: data.serviceSlug } }, { active: { equals: true } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const service = serviceResult.docs[0]
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Serviciul selectat nu este disponibil.' },
        { status: 400 },
      )
    }

    const settings =
      ((await payload.findGlobal({
        slug: 'availability-settings',
        depth: 0,
        overrideAccess: true,
      })) as AvailabilityConfig | null) ?? defaultAvailabilitySettings()

    const occupied = await payload.find({
      collection: 'appointments',
      where: {
        and: [
          { status: { in: [...BLOCKING_STATUSES] } },
          { slotKey: { equals: data.slotKey } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (occupied.totalDocs > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Intervalul selectat nu mai este disponibil. Alege altul.',
        },
        { status: 409 },
      )
    }

    const validSlot = listSlotsForDate(data.date, settings, new Set()).find(
      (slot) => slot.slotKey === data.slotKey,
    )

    if (!validSlot) {
      return NextResponse.json(
        {
          success: false,
          message: 'Intervalul selectat nu mai este disponibil. Alege altul.',
        },
        { status: 409 },
      )
    }

    const { token, hash } = createCancelToken()
    const timezone = settings.timezone || APPOINTMENT_TIMEZONE

    let created
    try {
      created = await payload.create({
        collection: 'appointments',
        data: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || undefined,
          service: service.id,
          carBrand: data.carBrand?.trim() || undefined,
          carModel: data.carModel?.trim() || undefined,
          licensePlate: data.licensePlate?.trim().toUpperCase() || undefined,
          requestedStart: validSlot.start,
          requestedEnd: validSlot.end,
          timezone,
          slotKey: validSlot.slotKey,
          status: 'pending',
          customerMessage: data.customerMessage?.trim() || undefined,
          source: 'website',
          submittedAt: new Date().toISOString(),
          cancelTokenHash: hash,
          ip: clientIp,
          userAgent: request.headers.get('user-agent') ?? '',
        },
        overrideAccess: true,
      })
      createdAppointmentId = created.id as number
    } catch (error) {
      console.error('Appointment create failed', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Intervalul selectat nu mai este disponibil. Alege altul.',
        },
        { status: 409 },
      )
    }

    for (const photo of processedPhotos) {
      const attachment = await payload.create({
        collection: 'contact-attachments',
        data: {
          appointment: createdAppointmentId,
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

    if (createdAttachmentIds.length && createdAppointmentId) {
      await payload.update({
        collection: 'appointments',
        id: createdAppointmentId,
        data: {
          photos: createdAttachmentIds,
        },
        overrideAccess: true,
      })
    }

    const cancelUrl = process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${token}/cancel`
      : undefined

    await sendAppointmentNotifications({
      appointmentId: createdAppointmentId!,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      serviceName: service.name,
      slotLabel: validSlot.label,
      date: data.date,
      customerMessage: data.customerMessage?.trim(),
      cancelUrl,
      photoCount: createdAttachmentIds.length,
    })

    return NextResponse.json({
      success: true,
      message:
        settings.confirmationText ||
        'Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei.',
    })
  } catch (error) {
    console.error('Appointment submission failed', error)

    try {
      const payload = await getPayloadClient()
      for (const id of createdAttachmentIds) {
        await payload.delete({
          collection: 'contact-attachments',
          id,
          overrideAccess: true,
        })
      }
      if (createdAppointmentId) {
        await payload.delete({
          collection: 'appointments',
          id: createdAppointmentId,
          overrideAccess: true,
        })
      }
    } catch (cleanupError) {
      console.error('Appointment cleanup failed', cleanupError)
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Nu am putut înregistra programarea. Încearcă din nou sau sună-ne.',
      },
      { status: 500 },
    )
  }
}
