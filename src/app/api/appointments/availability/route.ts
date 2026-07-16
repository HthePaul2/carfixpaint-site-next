import { NextResponse } from 'next/server'

import {
  APPOINTMENT_TIMEZONE,
  BLOCKING_STATUSES,
  defaultAvailabilitySettings,
  listSlotsForDate,
  type AvailabilityConfig,
} from '@/lib/appointments'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') ?? ''

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, message: 'Data este invalidă.' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()
    const settingsDoc =
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
          { slotKey: { contains: `${date}T` } },
        ],
      },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    const occupiedKeys = new Set(
      occupied.docs
        .map((doc) => doc.slotKey)
        .filter((value): value is string => Boolean(value)),
    )

    const slots = listSlotsForDate(date, settingsDoc, occupiedKeys)

    return NextResponse.json({
      success: true,
      date,
      timezone: settingsDoc.timezone || APPOINTMENT_TIMEZONE,
      slots,
    })
  } catch (error) {
    console.error('Availability lookup failed', error)
    return NextResponse.json(
      { success: false, message: 'Nu am putut încărca intervalele disponibile.' },
      { status: 500 },
    )
  }
}
