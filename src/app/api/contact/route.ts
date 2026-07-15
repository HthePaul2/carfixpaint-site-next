import { NextResponse } from 'next/server'

import { sendContactNotification } from '@/lib/contact-email'
import { getPayloadClient } from '@/lib/payload'
import { contactSchema, normalizeContactInput } from '@/lib/validation'

const MAX_REQUEST_BYTES = 16 * 1024
const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const SERVICE_LABELS: Record<string, string> = {
  tinichigerie: 'Tinichigerie & Caroserie',
  vopsitorie: 'Vopsitorie',
  mecanica: 'Mecanică Auto',
  diagnoza: 'Diagnoză Computerizată',
  daune: 'Daune RCA/CASCO',
  'daune-rca-casco': 'Daune RCA/CASCO',
  altele: 'Altele',
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

async function parseRequestBody(request: Request): Promise<unknown> {
  const rawBody = await request.text()
  const bodySize = new TextEncoder().encode(rawBody).byteLength

  if (bodySize > MAX_REQUEST_BYTES) {
    throw new Error('request_too_large')
  }

  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    throw new Error('invalid_json')
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown

    try {
      body = await parseRequestBody(request)
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

    const parsed = contactSchema.safeParse(body)

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
            {
              ip: {
                equals: clientIp,
              },
            },
            {
              submittedAt: {
                greater_than: submittedAfter,
              },
            },
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

    let serviceId: number | undefined
    let serviceLabel = SERVICE_LABELS[data.serviceType] ?? data.serviceType

    if (data.serviceType !== 'altele') {
      const serviceResult = await payload.find({
        collection: 'services',
        where: {
          slug: {
            equals: data.serviceType,
          },
        },
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
      },
      overrideAccess: true,
    })

    await sendContactNotification({
      requestId: created.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      serviceType: serviceLabel,
      message: data.message,
    })

    return NextResponse.json({
      success: true,
      message: 'Cererea a fost înregistrată.',
    })
  } catch (error) {
    console.error('Contact form submission failed', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Nu am putut trimite cererea. Încearcă din nou sau sună-ne direct.',
      },
      { status: 500 },
    )
  }
}
