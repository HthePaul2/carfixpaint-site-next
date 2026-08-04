'use client'

import { ArrowRight, CheckCircle, FileText, WhatsappLogo } from '@phosphor-icons/react'
import { useState } from 'react'
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
import { buildContactWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp'

type ServiceOption = {
  value: string
  label: string
}

type ContactPageProps = {
  content: ContactPageView
  serviceOptions: ServiceOption[]
}

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

export function ContactPage({ content, serviceOptions }: ContactPageProps) {
  const company = useSiteSettings()
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pageTitle = content.pageTitle || 'Trimite detaliile și fotografiile mașinii'
  const pageSubtitle =
    content.pageSubtitle ||
    'Descrie problema masinii, iar noi iti pregatim mesajul pentru WhatsApp. Daca vrei sa ne trimiti poze, o vei face direct in conversatie.'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!formData.serviceType) {
      toast.error('Alege serviciul pentru care vrei sa ne scrii.')
      return
    }

    if (!formData.gdprConsent) {
      toast.error('Trebuie sa accepti prelucrarea datelor pentru a continua pe WhatsApp.')
      return
    }

    setIsSubmitting(true)

    try {
      const serviceLabel =
        serviceOptions.find((option) => option.value === formData.serviceType)?.label ??
        formData.serviceType
      const message = buildContactWhatsAppMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        carBrand: formData.carBrand,
        licensePlate: formData.licensePlate,
        serviceType: serviceLabel,
        message: formData.message,
      })
      const whatsappHref = buildWhatsAppLink(company.whatsappNumber, message)
      const popup = window.open(whatsappHref, '_blank', 'noopener,noreferrer')

      if (!popup) {
        window.location.href = whatsappHref
      }

      toast.success('Se deschide WhatsApp. Trimite acolo mesajul si, daca vrei, pozele masinii.')
      setFormData(initialFormState)
    } catch {
      toast.error('Nu am putut deschide WhatsApp. Incearca din nou sau scrie-ne direct.')
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
                    Sunt de acord ca datele completate sa fie folosite pentru pregatirea mesajului
                    WhatsApp si pentru a fi contactat in legatura cu solicitarea. *
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Se pregateste WhatsApp...' : 'Continua pe WhatsApp'}
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
