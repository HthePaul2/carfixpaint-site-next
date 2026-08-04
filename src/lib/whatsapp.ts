/** Build a WhatsApp click-to-chat URL from site settings. */
export function buildWhatsAppLink(whatsappNumber: string, message?: string): string {
  const digits = whatsappNumber.replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (!message?.trim()) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

type ContactWhatsAppPayload = {
  name: string
  phone: string
  email?: string
  carBrand?: string
  licensePlate?: string
  serviceType: string
  message?: string
  hasPhotos?: boolean
}

type AppointmentWhatsAppPayload = {
  serviceLabel: string
  date: string
  slotLabel: string
  name: string
  phone: string
  email?: string
  carBrand?: string
  carModel?: string
  licensePlate?: string
  customerMessage?: string
  hasPhotos?: boolean
}

function line(label: string, value?: string): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return `${label}: ${trimmed}`
}

export function buildContactWhatsAppMessage(payload: ContactWhatsAppPayload): string {
  const lines = [
    'Buna ziua! Trimit o solicitare de contact de pe site:',
    line('Nume', payload.name),
    line('Telefon', payload.phone),
    line('Email', payload.email),
    line('Marca / model', payload.carBrand),
    line('Numar inmatriculare', payload.licensePlate),
    line('Tip serviciu', payload.serviceType),
    line('Descriere', payload.message),
    payload.hasPhotos
      ? 'Am selectat fotografii pe site si le trimit imediat in aceasta conversatie.'
      : null,
  ].filter(Boolean)

  return lines.join('\n')
}

export function buildAppointmentWhatsAppMessage(payload: AppointmentWhatsAppPayload): string {
  const lines = [
    'Buna ziua! Vreau sa fac o programare de pe site:',
    line('Serviciu', payload.serviceLabel),
    line('Data dorita', payload.date),
    line('Interval dorit', payload.slotLabel),
    line('Nume', payload.name),
    line('Telefon', payload.phone),
    line('Email', payload.email),
    line('Marca', payload.carBrand),
    line('Model', payload.carModel),
    line('Numar inmatriculare', payload.licensePlate),
    line('Observatii', payload.customerMessage),
    payload.hasPhotos
      ? 'Am selectat fotografii pe site si le trimit imediat in aceasta conversatie.'
      : null,
  ].filter(Boolean)

  return lines.join('\n')
}
