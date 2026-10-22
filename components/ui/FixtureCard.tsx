'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock, MapPin, UserRound } from 'lucide-react'
import { formatDayMonth, formatTime } from '@/lib/format'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Fixture, Team } from '@/lib/types'

interface FixtureCardProps {
  fixture: Fixture
  home?: Team
  away?: Team
}

function countdownLabel(kickoff: string, time: string): string | null {
  const target = new Date(`${kickoff}T${time}:00+03:00`).getTime()
  const diff = target - Date.now()
  if (Number.isNaN(target) || diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days >= 1) return `Kicks off in ${days}d ${hours}h`
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `Kicks off in ${hours}h ${minutes}m`
}

export function FixtureCard({ fixture, home, away }: FixtureCardProps) {
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    setCountdown(countdownLabel(fixture.kickoff, fixture.time))
    const timer = window.setInterval(() => setCountdown(countdownLabel(fixture.kickoff, fixture.time)), 60000)
    return () => window.clearInterval(timer)
  }, [fixture.kickoff, fixture.time])

  return (
    <Link
      href={`/match/${fixture.id}`}
      className="rl-card block p-4 sm:p-5 h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft">
          <CalendarDays size={14} aria-hidden="true" />
          {formatDayMonth(fixture.kickoff)}
        </span>
        <StatusPill status={fixture.status} />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm sm:text-base font-bold text-ink leading-snug">{home?.name ?? fixture.homeSlug}</p>
        <p className="text-[11px] font-black uppercase tracking-widest text-muted">vs</p>
        <p className="text-sm sm:text-base font-bold text-ink leading-snug">{away?.name ?? fixture.awaySlug}</p>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-muted">
        <p className="flex items-center gap-1.5">
          <Clock size={13} aria-hidden="true" />
          {formatTime(fixture.time)}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={13} aria-hidden="true" />
          <span className="truncate">{fixture.venue}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <UserRound size={13} aria-hidden="true" />
          <span className="truncate">{fixture.referee}</span>
        </p>
      </div>

      {countdown ? (
        <p className="mt-4">
          <span className="pill pill-live animate-countdown">{countdown}</span>
        </p>
      ) : null}
    </Link>
  )
}
