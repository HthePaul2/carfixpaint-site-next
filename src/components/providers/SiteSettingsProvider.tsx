'use client'

import { createContext, useContext } from 'react'

import type { SiteInfoView } from '@/lib/cms-types'
import { defaultSiteInfo } from '@/lib/defaults'

const SiteSettingsContext = createContext<SiteInfoView>(defaultSiteInfo)

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteInfoView
  children: React.ReactNode
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
