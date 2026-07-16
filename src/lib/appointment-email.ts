import { Resend } from 'resend'

type AppointmentNotificationData = {
  appointmentId: number
  name: string
  phone: string
  email?: string
  serviceName: string
  slotLabel: string
  date: string
  customerMessage?: string
  cancelUrl?: string
}

async function sendMail(input: {
  to: string
  subject: string
  text: string
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !from) return { sent: false, reason: 'email_not_configured' }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    })
    return { sent: true }
  } catch (error) {
    console.error('Appointment email failed', error)
    return { sent: false, reason: 'send_failed' }
  }
}

export async function sendAppointmentNotifications(data: AppointmentNotificationData) {
  const adminTo = process.env.CONTACT_NOTIFICATION_EMAIL
  const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/appointments/${data.appointmentId}`
    : undefined

  const adminResult = adminTo
    ? await sendMail({
        to: adminTo,
        subject: `Programare nouă — ${data.name}`,
        text: [
          'Ai primit o solicitare de programare.',
          '',
          `Nume: ${data.name}`,
          `Telefon: ${data.phone}`,
          data.email ? `Email: ${data.email}` : undefined,
          `Serviciu: ${data.serviceName}`,
          `Data: ${data.date}`,
          `Interval: ${data.slotLabel}`,
          data.customerMessage ? `Mesaj: ${data.customerMessage}` : undefined,
          adminUrl ? `Admin: ${adminUrl}` : undefined,
          '',
          'Status: în așteptarea confirmării.',
        ]
          .filter(Boolean)
          .join('\n'),
      })
    : { sent: false, reason: 'email_not_configured' }

  const clientResult = data.email
    ? await sendMail({
        to: data.email,
        subject: 'Solicitarea ta de programare a fost înregistrată',
        text: [
          `Bună, ${data.name},`,
          '',
          'Solicitarea ta de programare a fost înregistrată și așteaptă confirmarea echipei.',
          '',
          `Serviciu: ${data.serviceName}`,
          `Data: ${data.date}`,
          `Interval preferat: ${data.slotLabel}`,
          '',
          'Te contactăm telefonic sau pe email pentru confirmare sau pentru un interval alternativ.',
          data.cancelUrl ? `Anulare solicitare: ${data.cancelUrl}` : undefined,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    : { sent: false, reason: 'no_client_email' }

  return { adminResult, clientResult }
}
