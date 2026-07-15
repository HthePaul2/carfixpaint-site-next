'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, FileText, Phone } from '@phosphor-icons/react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!formData.gdprConsent) {
      toast.error('Trebuie să accepți Termenii și condițiile pentru a trimite formularul')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          carBrand: formData.carBrand,
          licensePlate: formData.licensePlate,
          serviceType: formData.serviceType,
          message: formData.message,
          gdprConsent: formData.gdprConsent,
          company: formData.company,
        }),
      })

      const result = (await response.json()) as { success?: boolean; message?: string }

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Nu am putut trimite cererea. Încearcă din nou.')
        return
      }

      toast.success('Cererea ta a fost trimisă cu succes! Te contactăm în maxim 2 ore.')
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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{content.pageSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Nume complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplu.ro"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="carBrand">Marcă și model auto</Label>
                    <Input
                      id="carBrand"
                      value={formData.carBrand}
                      onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                      placeholder="Ex: Audi A4, BMW X5"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="licensePlate">Număr de înmatriculare</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descrie problema ta..."
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
                    <Label htmlFor="gdpr" className="text-sm cursor-pointer">
                      Sunt de acord cu prelucrarea datelor personale conform Politicii de
                      Confidențialitate *
                    </Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Se trimite...' : 'Trimite Cererea'}
                    <ArrowRight weight="bold" size={20} className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">{content.contactCardTitle}</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone size={20} weight="bold" className="text-accent mt-0.5" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <a
                        href={`tel:${company.phone.replace(/\s/g, '')}`}
                        className="text-muted-foreground hover:text-accent"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText size={20} weight="bold" className="text-accent mt-0.5" />
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
                    <CheckCircle size={20} weight="bold" className="text-accent mt-0.5" />
                    <div>
                      <p className="font-medium">Adresă</p>
                      <p className="text-muted-foreground">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} weight="bold" className="text-accent mt-0.5" />
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
                <h3 className="font-semibold text-lg mb-2">{content.fastResponseTitle}</h3>
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
