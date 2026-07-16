/** Build a WhatsApp click-to-chat URL from site settings. */
export function buildWhatsAppLink(whatsappNumber: string, message?: string): string {
  const digits = whatsappNumber.replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (!message?.trim()) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
