import type { ComponentType, SVGProps } from 'react'
import {
  Car,
  CheckCircle,
  Clock,
  ComputerTower,
  Hammer,
  Lightning,
  PaintBrush,
  Phone,
  Shield,
  Wrench,
} from '@phosphor-icons/react/ssr'

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  }
>

/** Icons allowed in CMS (must stay in sync with `phosphorIconOptions`). SSR-safe. */
export const phosphorIconMap = {
  Hammer,
  PaintBrush,
  Wrench,
  ComputerTower,
  Shield,
  Car,
  Lightning,
  CheckCircle,
  Phone,
  Clock,
} as const satisfies Record<string, IconComponent>

export type PhosphorIconName = keyof typeof phosphorIconMap

export function resolvePhosphorIcon(iconName: string): IconComponent {
  if (iconName in phosphorIconMap) {
    return phosphorIconMap[iconName as PhosphorIconName]
  }
  return CheckCircle
}
