const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function toDate(value: string): Date {
  return new Date(value.includes('T') ? value : `${value}T12:00:00.000Z`)
}

export function formatDate(value: string): string {
  const date = toDate(value)
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatShortDate(value: string): string {
  const date = toDate(value)
  return `${date.getUTCDate()} ${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatWeekday(value: string): string {
  return WEEKDAYS[toDate(value).getUTCDay()]
}

export function formatDayMonth(value: string): string {
  const date = toDate(value)
  return `${SHORT_WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${SHORT_MONTHS[date.getUTCMonth()]}`
}

export function formatTime(value: string): string {
  const [hoursRaw, minutes] = value.split(':')
  const hours = Number(hoursRaw)
  const suffix = hours >= 12 ? 'pm' : 'am'
  const display = hours % 12 === 0 ? 12 : hours % 12
  return `${display}:${minutes}${suffix}`
}

export function formatSeasonRange(start: string, end: string): string {
  return `${formatShortDate(start)} to ${formatShortDate(end)}`
}

export function formatSeasonLabel(start: string, end: string): string {
  const startYear = new Date(start).getUTCFullYear()
  const endYear = new Date(end).getUTCFullYear()
  return startYear === endYear ? String(startYear) : `${startYear}/${String(endYear).slice(2)}`
}

export function formatGoalDifference(value: number): string {
  if (value > 0) return `+${value}`
  return String(value)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function plural(count: number, single: string, many?: string): string {
  return count === 1 ? single : many ?? `${single}s`
}
