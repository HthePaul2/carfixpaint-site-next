'use client'

import { useEffect, useState } from 'react'

import { FloatingActions } from '@/components/layout/FloatingActions'
import type { SiteInfoView } from '@/lib/cms-types'

/** Mount WhatsApp CTAs after first paint to keep homepage TBT low. */
export function DelayedFloatingActions({ company }: { company: SiteInfoView }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1))
    const cancel =
      window.cancelIdleCallback ?? ((id: number) => window.clearTimeout(id))
    const id = ric(() => setReady(true), { timeout: 1500 })
    return () => cancel(id as number)
  }, [])

  if (!ready) return null
  return <FloatingActions company={company} />
}
