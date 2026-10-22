import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, UserRound } from 'lucide-react'
import { MatchStatsChart } from '@/components/charts/MatchStatsChart'
import { TeamBadge } from '@/components/ui/TeamBadge'
import { StatusPill } from '@/components/ui/StatusPill'
import { getMatchDetail } from '@/lib/queries'
import { formatDate, formatTime } from '@/lib/format'

export const revalidate = 0

interface MatchPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params
  const detail = await getMatchDetail(id)
  if (!detail) return { title: 'Match not found' }
  const home = detail.home?.name ?? detail.fixture.homeSlug
  const away = detail.away?.name ?? detail.fixture.awaySlug
  return {
    title: `${home} vs ${away}`,
    description: `Match centre for ${home} vs ${away} in the ${detail.league?.name ?? 'league'}: score, scorers, cards, referee and match statistics.`,
  }
}

function eventLabel(type: string): string {
  if (type === 'penalty') return 'Penalty'
  if (type === 'own goal') return 'Own goal'
  return 'Goal'
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params
  const detail = await getMatchDetail(id)
  if (!detail) notFound()

  const { fixture, league, home, away, headToHead } = detail
  const homeName = home?.name ?? fixture.homeSlug
  const awayName = away?.name ?? fixture.awaySlug

  const goalEvents = fixture.events.filter(
    (event) => event.type === 'goal' || event.type === 'penalty' || event.type === 'own goal',
  )
  const homeGoals = goalEvents.filter((event) => event.teamSlug === fixture.homeSlug)
  const awayGoals = goalEvents.filter((event) => event.teamSlug === fixture.awaySlug)
  const homeCards = fixture.events.filter(
    (event) => event.teamSlug === fixture.homeSlug && (event.type === 'yellow' || event.type === 'red'),
  )
  const awayCards = fixture.events.filter(
    (event) => event.teamSlug === fixture.awaySlug && (event.type === 'yellow' || event.type === 'red'),
  )

  return (
    <>
      <section className="bg-ink text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Link
            href={league ? `/league/${league.slug}?tab=results` : '/leagues'}
            className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {league ? league.name : 'All leagues'}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusPill status={fixture.status} />
            <span className="text-xs text-white/60">
              Round {fixture.round}, {formatDate(fixture.kickoff)}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex-1 text-center sm:text-right">
              <div className="flex justify-center sm:justify-end">
                <TeamBadge name={homeName} seed={fixture.homeSlug} size={56} />
              </div>
              <p className="mt-2 text-base sm:text-lg font-black leading-snug">{homeName}</p>
              <p className="text-xs text-white/50">Home</p>
            </div>

            <div className="shrink-0 text-center px-2">
              {fixture.status === 'Upcoming' ? (
                <>
                  <p className="text-4xl sm:text-6xl font-bold leading-none text-white/40">vs</p>
                  <p className="mt-2 text-xs text-white/60">{formatTime(fixture.time)} kick off</p>
                </>
              ) : (
                <>
                  <p className="text-4xl sm:text-6xl font-bold leading-none">
                    {fixture.homeScore}
                    <span className="text-white/40 mx-1 font-light">-</span>
                    {fixture.awayScore}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-white/50">
                    {fixture.status === 'Live' ? 'Live score' : 'Full time'}
                  </p>
                </>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <TeamBadge name={awayName} seed={fixture.awaySlug} size={56} />
              </div>
              <p className="mt-2 text-base sm:text-lg font-black leading-snug">{awayName}</p>
              <p className="text-xs text-white/50">Away</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-8 text-xs text-white/70">
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} aria-hidden="true" />
              {fixture.venue}
            </span>
            <span className="inline-flex items-center gap-2">
              <UserRound size={14} aria-hidden="true" />
              Referee {fixture.referee}
            </span>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rl-card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-black text-ink">Goalscorers</h2>
              <p className="text-sm text-body">Goals with the minute and how they were scored.</p>

              {goalEvents.length === 0 ? (
                <p className="mt-4 text-sm text-body">
                  {fixture.status === 'Upcoming'
                    ? 'Goalscorers appear here once the match kicks off.'
                    : 'No goals were recorded in this match.'}
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {[
                    { team: homeName, events: homeGoals },
                    { team: awayName, events: awayGoals },
                  ].map((group) => (
                    <div key={group.team}>
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted">{group.team}</p>
                      {group.events.length === 0 ? (
                        <p className="text-sm text-muted mt-1">No goals</p>
                      ) : (
                        <ul className="mt-1 divide-y divide-line">
                          {group.events.map((event) => (
                            <li key={event.id} className="py-2 flex items-center gap-3">
                              <span className="inline-flex items-center justify-center min-w-[36px] h-7 bg-primary text-white text-xs font-black">
                                {event.minute}&apos;
                              </span>
                              <span className="flex-1 text-sm font-bold text-ink">{event.playerName}</span>
                              <span className="text-xs text-muted">{eventLabel(event.type)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rl-card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-black text-ink">Cards</h2>
              <p className="text-sm text-body">Yellow and red cards issued by the referee.</p>

              {homeCards.length + awayCards.length === 0 ? (
                <p className="mt-4 text-sm text-body">
                  {fixture.status === 'Upcoming'
                    ? 'Cards appear here once the match kicks off.'
                    : 'No cards were issued in this match.'}
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {[
                    { team: homeName, events: homeCards },
                    { team: awayName, events: awayCards },
                  ].map((group) =>
                    group.events.length === 0 ? null : (
                      <div key={group.team}>
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted">{group.team}</p>
                        <ul className="mt-1 divide-y divide-line">
                          {group.events.map((event) => (
                            <li key={event.id} className="py-2 flex items-center gap-3">
                              <span
                                className={`inline-block w-3.5 h-5 ${
                                  event.type === 'yellow' ? 'bg-accent' : 'bg-primary'
                                }`}
                                aria-hidden="true"
                              />
                              <span className="flex-1 text-sm font-bold text-ink">{event.playerName}</span>
                              <span className="text-xs text-muted">
                                {event.minute}&apos;, {event.type} card
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rl-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-black text-ink">Match statistics</h2>
            <p className="text-sm text-body">
              Possession, shots, corners and fouls for {homeName} and {awayName}.
            </p>
            {fixture.stats ? (
              <div className="mt-4">
                <MatchStatsChart stats={fixture.stats} homeName={homeName} awayName={awayName} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-body">
                Match statistics are published once the referee submits the match sheet.
              </p>
            )}
          </div>

          {headToHead.length > 0 ? (
            <div className="rl-card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-black text-ink">Head to head</h2>
              <ul className="mt-3 divide-y divide-line">
                {headToHead.map((entry) => (
                  <li key={entry.id} className="py-3 flex items-center justify-between gap-3">
                    <Link href={`/match/${entry.id}`} className="text-sm font-bold text-ink hover:text-primary">
                      {formatDate(entry.kickoff)}
                    </Link>
                    <span className="text-sm font-black text-ink">
                      {entry.homeScore} <span className="text-muted font-light">-</span> {entry.awayScore}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
