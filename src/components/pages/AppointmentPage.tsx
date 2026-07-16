'use client'

import { ArrowRight, X } from '@phosphor-icons/react'
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

const MAX_PHOTOS = 5
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

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

type PreviewPhoto = {
  id: string
  file: File
  url: string
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
  const [photos, setPhotos] = useState<PreviewPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [doneMessage, setDoneMessage] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
    }
  }, [photos])

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const maxDate = useMemo(() => {
    const now = new Date()
    now.setDate(now.getDate() + 60)
    return now.toISOString().slice(0, 10)
  }, [])
  const remainingSlots = useMemo(() => MAX_PHOTOS - photos.length, [photos.length])

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList)
    const next: PreviewPhoto[] = []
    const errors: string[] = []

    for (const file of incoming) {
      if (photos.length + next.length >= MAX_PHOTOS) {
        errors.push(`Maximum ${MAX_PHOTOS} fotografii.`)
        break
      }
      if (!ALLOWED_TYPES.has(file.type)) {
        errors.push(`${file.name}: format nepermis (JPG, PNG sau WebP).`)
        continue
      }
      if (file.size > MAX_PHOTO_BYTES) {
        errors.push(`${file.name}: depășește 5 MB.`)
        continue
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      })
    }

    if (errors.length) toast.error(errors[0])
    if (next.length) setPhotos((current) => [...current, ...next])
  }

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return current.filter((photo) => photo.id !== id)
    })
  }

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
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === 'boolean') body.append(key, value ? 'true' : 'false')
        else body.append(key, value)
      })
      body.append('serviceSlug', serviceSlug)
      body.append('date', date)
      body.append('slotKey', slotKey)
      photos.forEach((photo) => body.append('photos', photo.file))

      const response = await fetch('/api/appointments', {
        method: 'POST',
        body,
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
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
      setPhotos([])
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

          <div>
            <Label>Fotografii (opțional, max {MAX_PHOTOS})</Label>
            <div
              className={`mt-2 rounded-lg border border-dashed p-4 transition-colors ${
                isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/30'
              }`}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragging(false)
                if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files)
              }}
            >
              <input
                id="appointment-photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                disabled={isSubmitting || remainingSlots <= 0}
                onChange={(event) => {
                  if (event.target.files?.length) addFiles(event.target.files)
                  event.target.value = ''
                }}
              />
              <label
                htmlFor="appointment-photos"
                className="flex cursor-pointer flex-col items-center gap-2 py-4 text-center text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  Trage fotografiile aici sau apasă pentru selectare
                </span>
                <span>
                  Formate: JPG, PNG sau WebP. Maximum {MAX_PHOTOS} fotografii și 5 MB fiecare.
                </span>
              </label>
            </div>

            {photos.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <li key={photo.id} className="relative overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Elimină fotografia"
                      disabled={isSubmitting}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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
              Sunt de acord ca datele și fotografiile trimise să fie folosite pentru gestionarea
              programării. *
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
