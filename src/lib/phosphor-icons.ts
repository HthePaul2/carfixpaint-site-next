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
  type Icon,
} from '@phosphor-icons/react'

/** Icons allowed in CMS (must stay in sync with `phosphorIconOptions`). */
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
} as const satisfies Record<string, Icon>

export type PhosphorIconName = keyof typeof phosphorIconMap

export function resolvePhosphorIcon(iconName: string): Icon {
  if (iconName in phosphorIconMap) {
    return phosphorIconMap[iconName as PhosphorIconName]
  }
  return CheckCircle
}
