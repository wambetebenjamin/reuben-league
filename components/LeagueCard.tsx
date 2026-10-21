import Link from 'next/link'
import { ArrowRight, CalendarRange, MapPin, Users } from 'lucide-react'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatSeasonRange } from '@/lib/format'
import type { League } from '@/lib/types'

export function LeagueCard({ league }: { league: League }) {
  return (
    <Link
      href={`/league/${league.slug}`}
      className="rl-card group flex flex-col p-5 h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-primary">{league.sport}</span>
        <StatusPill status={league.status} />
      </div>

      <h3 className="mt-3 text-lg sm:text-xl font-black text-ink leading-snug group-hover:text-primary transition-colors">
        {league.name}
      </h3>
      <p className="mt-2 text-sm text-body line-clamp-2">{league.blurb}</p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <dt className="sr-only">County</dt>
          <MapPin size={14} className="text-muted" aria-hidden="true" />
          <dd className="text-ink-soft">{league.county} County</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Season</dt>
          <CalendarRange size={14} className="text-muted" aria-hidden="true" />
          <dd className="text-ink-soft">{formatSeasonRange(league.seasonStart, league.seasonEnd)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Teams</dt>
          <Users size={14} className="text-muted" aria-hidden="true" />
          <dd className="text-ink-soft">
            {league.teamCount} teams, season {league.season}
          </dd>
        </div>
      </dl>

      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink group-hover:text-primary">
        View league
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </Link>
  )
}
