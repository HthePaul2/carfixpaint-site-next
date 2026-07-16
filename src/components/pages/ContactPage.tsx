'use client'

import { ArrowRight, CheckCircle, FileText, WhatsappLogo, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ContactPageView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

type ServiceOption = {
  value: string
  label: string
}

type ContactPageProps = {
  content: ContactPageView
  serviceOptions: ServiceOption[]
}

const MAX_PHOTOS = 5
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  carBrand: '',
  licensePlate: '',
  serviceType: '',
  message: '',
  gdprConsent: false,
  company: '',
}

type PreviewPhoto = {
  id: string
  file: File
  url: string
}

export function ContactPage({ content, serviceOptions }: ContactPageProps) {
  const company = useSiteSettings()
  const [formData, setFormData] = useState(initialFormState)
  const [photos, setPhotos] = useState<PreviewPhoto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
    }
  }, [photos])

  const pageTitle = content.pageTitle || 'Trimite detaliile și fotografiile mașinii'
  const pageSubtitle =
    content.pageSubtitle ||
    'Descrie problema și încarcă până la 5 fotografii clare ale zonei afectate. Imaginile ne ajută la o primă orientare, dar soluția finală se stabilește după verificarea mașinii.'

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!formData.gdprConsent) {
      toast.error('Trebuie să accepți prelucrarea datelor pentru a trimite formularul.')
      return
    }

    setIsSubmitting(true)

    try {
      const body = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') body.append(key, value ? 'true' : 'false')
        else body.append(key, value)
      })
      photos.forEach((photo) => body.append('photos', photo.file))

      const response = await fetch('/api/contact', {
        method: 'POST',
        body,
      })

      const result = (await response.json()) as { success?: boolean; message?: string }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Nu am putut trimite cererea. Încearcă din nou.')
        return
      }

      toast.success(
        result.message ??
          'Cererea și fotografiile au fost trimise. Revenim cât mai curând posibil în programul de lucru.',
      )
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
      setPhotos([])
      setFormData(initialFormState)
    } catch {
      toast.error('Nu am putut trimite cererea. Încearcă din nou sau sună-ne direct.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{pageSubtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          <Card id="evaluare">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company}
                    onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="name">Nume complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="Ion Popescu"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    placeholder="0760 123 456"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    placeholder="email@exemplu.ro"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="carBrand">Marcă și model auto</Label>
                  <Input
                    id="carBrand"
                    value={formData.carBrand}
                    onChange={(event) => setFormData({ ...formData, carBrand: event.target.value })}
                    placeholder="Ex: Audi A4, BMW X5"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="licensePlate">Număr de înmatriculare</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(event) =>
                      setFormData({ ...formData, licensePlate: event.target.value })
                    }
                    placeholder="B 123 ABC"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="serviceType">Tip serviciu *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                    disabled={isSubmitting}
                    required
                  >
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
                  <Label htmlFor="message">Descriere problemă</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    placeholder="Descrie problema, zona afectată și orice simptome observate..."
                    rows={4}
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
                      id="photos"
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
                      htmlFor="photos"
                      className="flex cursor-pointer flex-col items-center gap-2 py-4 text-center text-sm text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">
                        Trage fotografiile aici sau apasă pentru selectare
                      </span>
                      <span>
                        Formate acceptate: JPG, PNG sau WebP. Maximum {MAX_PHOTOS} fotografii și 5 MB
                        pentru fiecare fișier.
                      </span>
                    </label>
                  </div>

                  {photos.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {photos.map((photo) => (
                        <li key={photo.id} className="relative overflow-hidden rounded-md border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt=""
                            className="aspect-square w-full object-cover"
                          />
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
                    checked={formData.gdprConsent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, gdprConsent: checked === true })
                    }
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="gdpr" className="cursor-pointer text-sm">
                    Sunt de acord ca datele și fotografiile trimise să fie folosite pentru analizarea
                    solicitării și pentru a fi contactat în legătură cu aceasta. *
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
                  <ArrowRight weight="bold" size={20} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">{content.contactCardTitle}</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <WhatsappLogo size={20} weight="fill" className="mt-0.5 text-accent" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a
                        href={buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText size={20} weight="bold" className="mt-0.5 text-accent" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-muted-foreground hover:text-accent"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="bold" className="mt-0.5 text-accent" />
                    <div>
                      <p className="font-medium">Adresă</p>
                      <p className="text-muted-foreground">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="bold" className="mt-0.5 text-accent" />
                    <div>
                      <p className="font-medium">Program</p>
                      <p className="text-muted-foreground">{company.schedule}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground">
              <CardContent className="p-6">
                <h2 className="mb-2 text-lg font-semibold">{content.fastResponseTitle}</h2>
                <p className="text-sm opacity-90">
                  {content.fastResponseText.replace('{phone}', company.phone)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
