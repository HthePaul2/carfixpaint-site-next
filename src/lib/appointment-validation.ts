import { createHash, randomBytes } from 'node:crypto'

import { z } from 'zod'

export const appointmentRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().optional().or(z.literal('')),
  serviceSlug: z.string().trim().min(1).max(100),
  carBrand: z.string().trim().max(100).optional(),
  carModel: z.string().trim().max(100).optional(),
  licensePlate: z.string().trim().max(20).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotKey: z.string().trim().min(8).max(80),
  customerMessage: z.string().trim().max(3000).optional(),
  company: z.string().max(0).optional(),
  gdprConsent: z.literal(true),
})

export type AppointmentRequestInput = z.infer<typeof appointmentRequestSchema>

export function createCancelToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString('hex')
  const hash = createHash('sha256').update(token).digest('hex')
  return { token, hash }
}

export function hashCancelToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
