import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal('')),
  carBrand: z.string().trim().max(100).optional(),
  licensePlate: z.string().trim().max(20).optional(),
  serviceType: z.string().trim().min(1).max(100),
  message: z.string().trim().max(3000).optional(),
  gdprConsent: z.literal(true),
  company: z.string().max(0).optional(),
})

export type ContactFormInput = z.infer<typeof contactSchema>

export function normalizeContactInput(input: ContactFormInput) {
  return {
    name: input.name.trim(),
    phone: input.phone.replace(/\s+/g, ' ').trim(),
    email: input.email?.trim() || undefined,
    carBrand: input.carBrand?.trim() || undefined,
    licensePlate: input.licensePlate?.trim().toUpperCase() || undefined,
    serviceType: input.serviceType.trim(),
    message: input.message?.trim() || undefined,
    gdprConsent: true as const,
  }
}
