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
import { getPayloadClient } from '@/lib/payload'

const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown
    const parsed = appointmentRequestSchema.safeParse(body)

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

    const cancelUrl = process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${token}/cancel`
      : undefined

    await sendAppointmentNotifications({
      appointmentId: created.id as number,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      serviceName: service.name,
      slotLabel: validSlot.label,
      date: data.date,
      customerMessage: data.customerMessage?.trim(),
      cancelUrl,
    })

    return NextResponse.json({
      success: true,
      message:
        settings.confirmationText ||
        'Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei.',
    })
  } catch (error) {
    console.error('Appointment submission failed', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Nu am putut înregistra programarea. Încearcă din nou sau sună-ne.',
      },
      { status: 500 },
    )
  }
}
