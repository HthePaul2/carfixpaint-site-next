'use client'

import { useEffect, useState, type ComponentType } from 'react'

/** Load sonner after idle so it does not contribute to TBT on first paint. */
export function DelayedToaster() {
  const [Toaster, setToaster] = useState<ComponentType | null>(null)

  useEffect(() => {
    const ric =
      window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1) as unknown as number)
    const cancel =
      window.cancelIdleCallback ?? ((id: number) => window.clearTimeout(id))

    const id = ric(() => {
      void import('@/components/ui/sonner').then((mod) => {
        setToaster(() => mod.Toaster)
      })
    }, { timeout: 2500 })

    return () => cancel(id as number)
  }, [])

  if (!Toaster) return null
  return <Toaster />
}
