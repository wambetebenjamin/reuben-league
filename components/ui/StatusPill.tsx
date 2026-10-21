import type { LeagueStatus, MatchStatus } from '@/lib/types'

type Status = LeagueStatus | MatchStatus

const CLASSES: Record<Status, string> = {
  Active: 'pill pill-active',
  Upcoming: 'pill pill-upcoming',
  Completed: 'pill pill-completed',
  Live: 'pill pill-live',
  'Full Time': 'pill pill-completed',
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={CLASSES[status]}>
      {status === 'Live' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-live-dot" aria-hidden="true" />
      ) : null}
      {status}
    </span>
  )
}
