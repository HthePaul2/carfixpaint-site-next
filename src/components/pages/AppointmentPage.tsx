'use client'

import { ArrowRight } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type ServiceOption = {
  value: string
  label: string
}

type Slot = {
  start: string
  end: string
  label: string
  slotKey: string
}

type AppointmentPageProps = {
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

export function AppointmentPage({ serviceOptions }: AppointmentPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('service') ?? ''

  const [serviceSlug, setServiceSlug] = useState(
    serviceOptions.some((option) => option.value === preselected) ? preselected : '',
  )
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotKey, setSlotKey] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [doneMessage, setDoneMessage] = useState<string | null>(null)

  const minDate = useMemo(() => {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  }, [])

  const maxDate = useMemo(() => {
    const now = new Date()
    now.setDate(now.getDate() + 60)
    return now.toISOString().slice(0, 10)
  }, [])

  const loadSlots = useCallback(async (selectedDate: string) => {
    if (!selectedDate) {
      setSlots([])
      setSlotKey('')
      return
    }

    setLoadingSlots(true)
    try {
      const response = await fetch(`/api/appointments/availability?date=${selectedDate}`)
      const result = (await response.json()) as {
        success?: boolean
        slots?: Slot[]
        message?: string
      }
      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Nu am putut încărca intervalele.')
        setSlots([])
        setSlotKey('')
        return
      }
      setSlots(result.slots ?? [])
      setSlotKey('')
    } catch {
      toast.error('Nu am putut încărca intervalele.')
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (date) void loadSlots(date)
  }, [date, loadSlots])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!serviceSlug || !date || !slotKey) {
      toast.error('Selectează serviciul, data și intervalul.')
      return
    }
    if (!form.gdprConsent) {
      toast.error('Trebuie să accepți prelucrarea datelor.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceSlug,
          date,
          slotKey,
          gdprConsent: true,
        }),
      })
      const result = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Nu am putut înregistra programarea.')
        if (response.status === 409) await loadSlots(date)
        return
      }

      setDoneMessage(
        result.message ??
          'Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei.',
      )
      setForm(initialForm)
      setSlotKey('')
      toast.success('Solicitarea a fost înregistrată.')
    } catch {
      toast.error('Nu am putut înregistra programarea. Încearcă din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (doneMessage) {
    return (
      <div className="py-16">
        <div className="container max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Solicitare înregistrată</h1>
          <p className="mb-8 text-lg text-muted-foreground">{doneMessage}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => setDoneMessage(null)}>Altă programare</Button>
            <Button variant="outline" onClick={() => router.push('/contact')}>
              Trimite fotografii
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
            Solicită o programare pentru constatare
          </h1>
          <p className="text-lg text-muted-foreground">
            Alege serviciul, ziua și intervalul preferat. Cererea este verificată de echipă, iar
            programarea devine valabilă după confirmarea telefonică sau prin email.
          </p>
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
            <Label>Interval disponibil *</Label>
            {loadingSlots ? (
              <p className="mt-2 text-sm text-muted-foreground">Se încarcă intervalele...</p>
            ) : !date ? (
              <p className="mt-2 text-sm text-muted-foreground">Selectează mai întâi o dată.</p>
            ) : slots.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nu există intervale disponibile în această zi.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((slot) => (
                  <button
                    key={slot.slotKey}
                    type="button"
                    className={
                      slotKey === slot.slotKey
                        ? 'rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground'
                        : 'rounded-md border px-3 py-2 text-sm hover:bg-secondary'
                    }
                    onClick={() => setSlotKey(slot.slotKey)}
                    disabled={isSubmitting}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Intervalele afișate sunt pentru constatare și evaluare. Durata reparației se stabilește
              separat după verificarea mașinii.
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
              Sunt de acord ca datele trimise să fie folosite pentru gestionarea programării. *
            </Label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Se trimite...' : 'Trimite solicitarea'}
            <ArrowRight weight="bold" size={20} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  )
}
