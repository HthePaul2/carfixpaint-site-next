'use client'

import { ArrowRight, CheckCircle, FileText, Phone } from '@phosphor-icons/react'
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

  const pageSubtitle =
    content.pageSubtitle?.replace(
      'și atașează, când este posibil, fotografii clare ale zonei afectate.',
      'Fotografiile clare ale zonei afectate pot fi trimise ulterior pe WhatsApp sau email.',
    ) ??
    'Spune-ne ce problemă are mașina. Fotografiile pot fi trimise ulterior pe WhatsApp sau email.'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!formData.gdprConsent) {
      toast.error('Trebuie să accepți Politica de confidențialitate pentru a trimite formularul.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = (await response.json()) as { success?: boolean; message?: string }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Nu am putut trimite cererea. Încearcă din nou.')
        return
      }

      toast.success(
        'Cererea a fost trimisă cu succes. Revenim cât mai curând posibil în programul de lucru.',
      )
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
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{pageSubtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} />
                </div>

                <div>
                  <Label htmlFor="name">Nume complet *</Label>
                  <Input id="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Ion Popescu" required disabled={isSubmitting} />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="0760 123 456" required disabled={isSubmitting} />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="email@exemplu.ro" disabled={isSubmitting} />
                </div>

                <div>
                  <Label htmlFor="carBrand">Marcă și model auto</Label>
                  <Input id="carBrand" value={formData.carBrand} onChange={(event) => setFormData({ ...formData, carBrand: event.target.value })} placeholder="Ex: Audi A4, BMW X5" disabled={isSubmitting} />
                </div>

                <div>
                  <Label htmlFor="licensePlate">Număr de înmatriculare</Label>
                  <Input id="licensePlate" value={formData.licensePlate} onChange={(event) => setFormData({ ...formData, licensePlate: event.target.value })} placeholder="B 123 ABC" disabled={isSubmitting} />
                </div>

                <div>
                  <Label htmlFor="serviceType">Tip serviciu *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })} disabled={isSubmitting} required>
                    <SelectTrigger><SelectValue placeholder="Alege serviciul" /></SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Descriere problemă</Label>
                  <Textarea id="message" value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Descrie problema, zona afectată și orice simptome observate..." rows={4} disabled={isSubmitting} />
                  <p className="mt-2 text-xs text-muted-foreground">Formularul nu încarcă fotografii. Le poți trimite ulterior pe WhatsApp sau email, după confirmarea solicitării.</p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="gdpr" checked={formData.gdprConsent} onCheckedChange={(checked) => setFormData({ ...formData, gdprConsent: checked === true })} disabled={isSubmitting} />
                  <Label htmlFor="gdpr" className="cursor-pointer text-sm">Sunt de acord cu prelucrarea datelor personale conform Politicii de confidențialitate. *</Label>
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
                  <div className="flex items-start gap-3"><Phone size={20} weight="bold" className="mt-0.5 text-accent" /><div><p className="font-medium">Telefon</p><a href={`tel:${company.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-accent">{company.phone}</a></div></div>
                  <div className="flex items-start gap-3"><FileText size={20} weight="bold" className="mt-0.5 text-accent" /><div><p className="font-medium">Email</p><a href={`mailto:${company.email}`} className="text-muted-foreground hover:text-accent">{company.email}</a></div></div>
                  <div className="flex items-start gap-3"><CheckCircle size={20} weight="bold" className="mt-0.5 text-accent" /><div><p className="font-medium">Adresă</p><p className="text-muted-foreground">{company.address}</p></div></div>
                  <div className="flex items-start gap-3"><CheckCircle size={20} weight="bold" className="mt-0.5 text-accent" /><div><p className="font-medium">Program</p><p className="text-muted-foreground">{company.schedule}</p></div></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground">
              <CardContent className="p-6">
                <h2 className="mb-2 text-lg font-semibold">{content.fastResponseTitle}</h2>
                <p className="text-sm opacity-90">{content.fastResponseText.replace('{phone}', company.phone)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
