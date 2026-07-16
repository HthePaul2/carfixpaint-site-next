import { NextResponse } from 'next/server'

import { hashCancelToken } from '@/lib/appointment-validation'
import { getPayloadClient } from '@/lib/payload'

type RouteContext = {
  params: Promise<{ token: string }>
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params
    if (!token || token.length < 20) {
      return NextResponse.json({ success: false, message: 'Token invalid.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const hash = hashCancelToken(token)
    const result = await payload.find({
      collection: 'appointments',
      where: { cancelTokenHash: { equals: hash } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const appointment = result.docs[0]
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Solicitarea nu a fost găsită.' },
        { status: 404 },
      )
    }

    if (['cancelled', 'rejected', 'completed'].includes(String(appointment.status))) {
      return NextResponse.json({
        success: true,
        message: 'Solicitarea este deja închisă.',
      })
    }

    await payload.update({
      collection: 'appointments',
      id: appointment.id,
      data: {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: 'Anulată de client',
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitarea a fost anulată.',
    })
  } catch (error) {
    console.error('Appointment cancel failed', error)
    return NextResponse.json(
      { success: false, message: 'Nu am putut anula solicitarea.' },
      { status: 500 },
    )
  }
}
