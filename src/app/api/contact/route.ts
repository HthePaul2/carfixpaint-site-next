import { NextResponse } from 'next/server'

import { sendContactNotification } from '@/lib/contact-email'
import { getPayloadClient } from '@/lib/payload'
import { contactSchema, normalizeContactInput } from '@/lib/validation'

const SERVICE_LABELS: Record<string, string> = {
  tinichigerie: 'Tinichigerie & Caroserie',
  vopsitorie: 'Vopsitorie',
  mecanica: 'Mecanică Auto',
  diagnoza: 'Diagnoză Computerizată',
  daune: 'Daune RCA/CASCO',
  altele: 'Altele',
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
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
        ip: getClientIp(request),
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
