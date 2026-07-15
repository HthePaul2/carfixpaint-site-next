import { Resend } from 'resend'

type ContactNotificationData = {
  requestId: number
  name: string
  phone: string
  email?: string
  serviceType: string
  message?: string
}

export async function sendContactNotification(data: ContactNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_NOTIFICATION_EMAIL

  if (!apiKey || !from || !to) {
    return { sent: false, reason: 'email_not_configured' as const }
  }

  const resend = new Resend(apiKey)
  const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/contact-requests/${data.requestId}`
    : undefined

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Cerere contact nouă — ${data.name}`,
      text: [
        'Ai primit o cerere nouă pe site.',
        '',
        `Nume: ${data.name}`,
        `Telefon: ${data.phone}`,
        data.email ? `Email: ${data.email}` : undefined,
        `Serviciu: ${data.serviceType}`,
        data.message ? `Mesaj: ${data.message}` : undefined,
        adminUrl ? `Admin: ${adminUrl}` : undefined,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    return { sent: true as const }
  } catch (error) {
    console.error('Contact notification email failed', {
      requestId: data.requestId,
      error,
    })
    return { sent: false, reason: 'send_failed' as const }
  }
}
