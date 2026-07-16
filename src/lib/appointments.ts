import { addDays, addMinutes, format } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

export const APPOINTMENT_TIMEZONE = 'Europe/Bucharest'
export const BLOCKING_STATUSES = ['pending', 'confirmed', 'reschedule-proposed'] as const

type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

type DaySchedule = {
  enabled?: boolean | null
  start?: string | null
  end?: string | null
}

export type AvailabilityConfig = {
  timezone?: string | null
  slotDurationMinutes?: number | null
  minNoticeHours?: number | null
  maxAdvanceDays?: number | null
  capacityPerSlot?: number | null
  breakStart?: string | null
  breakEnd?: string | null
  confirmationText?: string | null
  monday?: DaySchedule | null
  tuesday?: DaySchedule | null
  wednesday?: DaySchedule | null
  thursday?: DaySchedule | null
  friday?: DaySchedule | null
  saturday?: DaySchedule | null
  sunday?: DaySchedule | null
  blockedDates?:
    | {
        date?: string | null
        reason?: string | null
      }[]
    | null
}

const DAY_KEYS: DayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export type AvailabilitySlot = {
  start: string
  end: string
  label: string
  slotKey: string
}

export function defaultAvailabilitySettings(): AvailabilityConfig {
  return {
    timezone: APPOINTMENT_TIMEZONE,
    slotDurationMinutes: 30,
    minNoticeHours: 2,
    maxAdvanceDays: 60,
    capacityPerSlot: 1,
    breakStart: '12:00',
    breakEnd: '13:00',
    confirmationText:
      'Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei sau pentru a propune un interval alternativ.',
    monday: { enabled: true, start: '08:00', end: '17:00' },
    tuesday: { enabled: true, start: '08:00', end: '17:00' },
    wednesday: { enabled: true, start: '08:00', end: '17:00' },
    thursday: { enabled: true, start: '08:00', end: '17:00' },
    friday: { enabled: true, start: '08:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '13:00' },
    sunday: { enabled: false, start: '09:00', end: '13:00' },
    blockedDates: [],
  }
}

function parseHm(value: string | null | undefined): { hours: number; minutes: number } | null {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null
  const [hours, minutes] = value.split(':').map(Number)
  if (hours > 23 || minutes > 59) return null
  return { hours, minutes }
}

function minutesOfDay(hours: number, minutes: number): number {
  return hours * 60 + minutes
}

function overlapsBreak(
  startMin: number,
  endMin: number,
  breakStart?: string | null,
  breakEnd?: string | null,
): boolean {
  const start = parseHm(breakStart ?? undefined)
  const end = parseHm(breakEnd ?? undefined)
  if (!start || !end) return false
  const bStart = minutesOfDay(start.hours, start.minutes)
  const bEnd = minutesOfDay(end.hours, end.minutes)
  return startMin < bEnd && endMin > bStart
}

export function buildSlotKey(date: string, time: string, timezone = APPOINTMENT_TIMEZONE): string {
  return `${date}T${time}|${timezone}`
}

export function listSlotsForDate(
  date: string,
  settings: AvailabilityConfig,
  occupiedSlotKeys: Set<string>,
  now = new Date(),
): AvailabilitySlot[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return []

  const timezone = settings.timezone || APPOINTMENT_TIMEZONE
  const zonedNow = toZonedTime(now, timezone)
  const todayStr = format(zonedNow, 'yyyy-MM-dd')
  const maxDate = format(addDays(zonedNow, settings.maxAdvanceDays ?? 60), 'yyyy-MM-dd')

  if (date < todayStr || date > maxDate) return []

  const blocked = (settings.blockedDates ?? []).some((entry) => {
    if (!entry?.date) return false
    return format(toZonedTime(new Date(entry.date), timezone), 'yyyy-MM-dd') === date
  })
  if (blocked) return []

  const noonLocal = toZonedTime(fromZonedTime(`${date} 12:00:00`, timezone), timezone)
  const dayKey = DAY_KEYS[noonLocal.getDay()]
  const day = settings[dayKey] as DaySchedule | null | undefined
  if (!day?.enabled) return []

  const open = parseHm(day.start)
  const close = parseHm(day.end)
  if (!open || !close) return []

  const duration = settings.slotDurationMinutes ?? 30
  const minNoticeMs = (settings.minNoticeHours ?? 2) * 60 * 60 * 1000
  const earliest = new Date(now.getTime() + minNoticeMs)
  const slots: AvailabilitySlot[] = []

  for (
    let cursor = minutesOfDay(open.hours, open.minutes);
    cursor + duration <= minutesOfDay(close.hours, close.minutes);
    cursor += duration
  ) {
    const endCursor = cursor + duration
    if (overlapsBreak(cursor, endCursor, settings.breakStart, settings.breakEnd)) continue

    const hours = Math.floor(cursor / 60)
    const minutes = cursor % 60
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    const slotKey = buildSlotKey(date, time, timezone)
    if (occupiedSlotKeys.has(slotKey)) continue

    const startUtc = fromZonedTime(`${date} ${time}:00`, timezone)
    if (startUtc < earliest) continue

    const endUtc = addMinutes(startUtc, duration)
    slots.push({
      start: startUtc.toISOString(),
      end: endUtc.toISOString(),
      label: time,
      slotKey,
    })
  }

  return slots
}
