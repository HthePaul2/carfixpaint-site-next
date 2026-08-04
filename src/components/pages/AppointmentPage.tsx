'use client'

import { ArrowRight } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ProgramarePageView } from '@/lib/cms-types'
import { buildAppointmentWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp'

type ServiceOption = {
  value: string
  label: string
}

type AppointmentPageProps = {
  content: ProgramarePageView
  serviceOptions: ServiceOption[]
}

const initialForm = {
  name: '',
  phone: '',
  email: '',
  carBrand: '',
  carModel: '',
  licensePlate: '',
  customerMessage: '',
  company: '',
  gdprConsent: false,
}

const preferredTimeOptions = [
  'Dimineata (08:00 - 11:00)',
  'Pranz (11:00 - 14:00)',
  'Dupa-amiaza (14:00 - 17:00)',
]

export function AppointmentPage({ content, serviceOptions }: AppointmentPageProps) {
  const company = useSiteSettings()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('service') ?? ''

  const [serviceSlug, setServiceSlug] = useState(
    serviceOptions.some((option) => option.value === preselected) ? preselected : '',
  )
  const [date, setDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [doneMessage, setDoneMessage] = useState<string | null>(null)

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const maxDate = useMemo(() => {
    const now = new Date()
    now.setDate(now.getDate() + 60)
    return now.toISOString().slice(0, 10)
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!serviceSlug || !date || !preferredTime) {
      toast.error('Selecteaza serviciul, data si intervalul preferat.')
      return
    }
    if (!form.gdprConsent) {
      toast.error('Trebuie sa accepti prelucrarea datelor pentru a continua pe WhatsApp.')
      return
    }

    setIsSubmitting(true)
    try {
      const serviceLabel =
        serviceOptions.find((option) => option.value === serviceSlug)?.label ?? serviceSlug
      const message = buildAppointmentWhatsAppMessage({
        serviceLabel,
        date,
        slotLabel: preferredTime,
        name: form.name,
        phone: form.phone,
        email: form.email,
        carBrand: form.carBrand,
        carModel: form.carModel,
        licensePlate: form.licensePlate,
        customerMessage: form.customerMessage,
      })
      const whatsappHref = buildWhatsAppLink(company.whatsappNumber, message)
      const popup = window.open(whatsappHref, '_blank', 'noopener,noreferrer')

      setDoneMessage(
        'WhatsApp a fost deschis. Trimite mesajul si continua acolo pentru confirmarea programarii.',
      )
      if (!popup) {
        window.location.href = whatsappHref
      }
      setForm(initialForm)
      setPreferredTime('')
      toast.success('Se deschide WhatsApp. Trimite acolo mesajul pentru confirmarea programarii.')
    } catch {
      toast.error('Nu am putut deschide WhatsApp. Incearca din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (doneMessage) {
    return (
      <div className="py-16">
        <div className="container max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Continua pe WhatsApp</h1>
          <p className="mb-8 text-lg text-muted-foreground">{doneMessage}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => setDoneMessage(null)}>Alta programare</Button>
            <Button variant="outline" onClick={() => router.push('/contact')}>
              Mergi la contact
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {content.pageTitle}
          </h1>
          {content.pageSubtitle ? (
            <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6 md:p-8">
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(event) => setForm({ ...form, company: event.target.value })}
            />
          </div>

          <div>
            <Label>Serviciu *</Label>
            <Select value={serviceSlug} onValueChange={setServiceSlug} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Alege serviciul" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Interval preferat *</Label>
            <Select value={preferredTime} onValueChange={setPreferredTime} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Alege intervalul preferat" />
              </SelectTrigger>
              <SelectContent>
                {preferredTimeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-3 text-xs text-muted-foreground">
              Intervalul este orientativ. Confirmarea finala se face in conversatia WhatsApp, in
              functie de disponibilitatea reala.
            </p>
          </div>

          <div>
            <Label htmlFor="name">Nume *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="carBrand">Marcă</Label>
              <Input
                id="carBrand"
                value={form.carBrand}
                onChange={(event) => setForm({ ...form, carBrand: event.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="carModel">Model</Label>
              <Input
                id="carModel"
                value={form.carModel}
                onChange={(event) => setForm({ ...form, carModel: event.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="licensePlate">Număr înmatriculare</Label>
            <Input
              id="licensePlate"
              value={form.licensePlate}
              onChange={(event) => setForm({ ...form, licensePlate: event.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="customerMessage">Observații</Label>
            <Textarea
              id="customerMessage"
              value={form.customerMessage}
              onChange={(event) => setForm({ ...form, customerMessage: event.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="gdpr"
              checked={form.gdprConsent}
              onCheckedChange={(checked) =>
                setForm({ ...form, gdprConsent: checked === true })
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="gdpr" className="cursor-pointer text-sm">
              Sunt de acord ca datele completate sa fie folosite pentru pregatirea mesajului
              WhatsApp si pentru gestionarea programarii. *
            </Label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Se pregateste WhatsApp...' : 'Continua pe WhatsApp'}
            <ArrowRight weight="bold" size={20} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  )
}
