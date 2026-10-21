import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, MapPin, UserRound, Users } from 'lucide-react'
import { PointsChart } from '@/components/charts/PointsChart'
import { StandingsTable } from '@/components/ui/StandingsTable'
import { StatusPill } from '@/components/ui/StatusPill'
import { getLeagueOverview } from '@/lib/queries'
import { formatDayMonth, formatSeasonRange, formatTime } from '@/lib/format'

export const revalidate = 0

const TABS = [
  { key: 'standings', label: 'Standings' },
  { key: 'fixtures', label: 'Fixtures' },
  { key: 'results', label: 'Results' },
  { key: 'scorers', label: 'Top Scorers' },
  { key: 'referees', label: 'Referees' },
] as const

type TabKey = (typeof TABS)[number]['key']

interface LeaguePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: LeaguePageProps): Promise<Metadata> {
  const { slug } = await params
  const overview = await getLeagueOverview(slug)
  if (!overview) return { title: 'League not found' }
  return {
    title: overview.league.name,
    description: `${overview.league.name}: ${overview.league.sport} in ${overview.league.county} County. Live standings, fixtures, results, top scorers and referees.`,
  }
}

export default async function LeaguePage({ params, searchParams }: LeaguePageProps) {
  const { slug } = await params
  const { tab } = await searchParams
  const overview = await getLeagueOverview(slug)
  if (!overview) notFound()

  const activeTab: TabKey = TABS.some((entry) => entry.key === tab) ? (tab as TabKey) : 'standings'
  const { league, teams, fixtures, standings, scorers, referees } = overview

  const teamMap = new Map(teams.map((team) => [team.slug, team]))
  const teamName = (slugValue: string) => teamMap.get(slugValue)?.name ?? slugValue

  const upcoming = fixtures
    .filter((fixture) => fixture.status !== 'Full Time')
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
  const results = fixtures
    .filter((fixture) => fixture.status === 'Full Time')
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
  const completed = results.length
  const goalsScored = results.reduce((total, fixture) => total + (fixture.homeScore ?? 0) + (fixture.awayScore ?? 0), 0)

  const chartData = standings.map((row) => ({
    team: row.teamName.length > 14 ? `${row.teamName.slice(0, 13)}.` : row.teamName,
    points: row.points,
    goalDifference: row.goalDifference,
  }))

  return (
    <>
      <section className="relative bg-ink text-white">
        <Image
          src="/images/football-action.jpg"
          alt="Footballers competing during a community league match"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-30"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/leagues"
            className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            All leagues
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary-soft">{league.sport}</span>
            <StatusPill status={league.status} />
          </div>

          <h1 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">{league.name}</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/75">{league.blurb}</p>

          <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Season</dt>
              <dd className="text-white font-bold">{league.season}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-white/50 font-bold">County</dt>
              <dd className="text-white font-bold">{league.county}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Teams</dt>
              <dd className="text-white font-bold">{teams.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Organiser</dt>
              <dd className="text-white font-bold">{league.organiser}</dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-white/60">
            {formatSeasonRange(league.seasonStart, league.seasonEnd)}. {completed} matches played, {goalsScored} scores
            recorded.
          </p>
        </div>
      </section>

      <div className="sticky top-16 sm:top-20 z-30 bg-white border-b border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="League sections" className="flex overflow-x-auto gap-0 -mx-4 px-4 no-scrollbar">
            {TABS.map((entry) => {
              const active = entry.key === activeTab
              return (
                <Link
                  key={entry.key}
                  href={`/league/${league.slug}?tab=${entry.key}`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 min-h-[44px] inline-flex items-center whitespace-nowrap transition-colors ${
                    active
                      ? 'border-primary text-ink font-bold'
                      : 'border-transparent text-muted hover:text-ink hover:border-line-2'
                  }`}
                >
                  {entry.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'standings' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink">Standings</h2>
                <p className="mt-1 text-sm text-body">
                  {league.name}, season {league.season}. Three points for a win, one for a draw.
                </p>
                <div className="mt-4 rl-card p-4 sm:p-6">
                  {standings.length > 0 ? (
                    <StandingsTable rows={standings} />
                  ) : (
                    <p className="text-sm text-body">The table appears once the first result is entered.</p>
                  )}
                </div>
              </div>

              {standings.length > 0 ? (
                <div className="rl-card p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-black text-ink">Points per team</h3>
                  <p className="text-sm text-body mb-3">Bar height shows league points after {completed} matches.</p>
                  <PointsChart data={chartData} />
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === 'fixtures' ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Fixtures</h2>
              <p className="mt-1 text-sm text-body">Upcoming matches with venue and appointed referee.</p>

              {upcoming.length === 0 ? (
                <div className="mt-6 rl-card p-6">
                  <p className="text-sm text-body">No upcoming fixtures are published for this league yet.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {upcoming.map((fixture) => (
                    <Link
                      key={fixture.id}
                      href={`/match/${fixture.id}`}
                      className="rl-card block p-4 sm:p-5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="sm:w-32 shrink-0">
                          <p className="text-xs font-black uppercase tracking-widest text-primary">
                            Round {fixture.round}
                          </p>
                          <p className="text-sm font-bold text-ink">{formatDayMonth(fixture.kickoff)}</p>
                          <p className="text-xs text-muted">{formatTime(fixture.time)} kick off</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-black text-ink">
                            {teamName(fixture.homeSlug)} <span className="text-muted font-light">vs</span>{' '}
                            {teamName(fixture.awaySlug)}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={13} aria-hidden="true" />
                              {fixture.venue}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound size={13} aria-hidden="true" />
                              {fixture.referee}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <StatusPill status={fixture.status} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === 'results' ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Results</h2>
              <p className="mt-1 text-sm text-body">Final scores with goalscorers and cards.</p>

              {results.length === 0 ? (
                <div className="mt-6 rl-card p-6">
                  <p className="text-sm text-body">
                    No results have been entered yet. Results appear here the moment an organiser saves them.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {results.map((fixture) => (
                    <div key={fixture.id} className="rl-card p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-muted">
                        <span>
                          Round {fixture.round}, {formatDayMonth(fixture.kickoff)}
                        </span>
                        <Link href={`/match/${fixture.id}`} className="font-bold text-primary hover:underline">
                          Match centre
                        </Link>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="text-sm sm:text-base font-bold text-ink flex-1 text-right leading-snug">
                          {teamName(fixture.homeSlug)}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-ink whitespace-nowrap">
                          {fixture.homeScore} <span className="text-muted font-light">-</span> {fixture.awayScore}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-ink flex-1 leading-snug">
                          {teamName(fixture.awaySlug)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-black uppercase tracking-widest text-muted mb-1">Goals</p>
                          {fixture.events.filter((event) => event.type !== 'yellow' && event.type !== 'red').length >
                          0 ? (
                            <ul className="space-y-1">
                              {fixture.events
                                .filter((event) => event.type !== 'yellow' && event.type !== 'red')
                                .map((event) => (
                                  <li key={event.id} className="text-ink-soft">
                                    {event.minute}&apos; {event.playerName}
                                    <span className="text-muted">
                                      {event.type === 'penalty'
                                        ? ' (pen)'
                                        : event.type === 'own goal'
                                          ? ' (og)'
                                          : ''}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-muted">No goals recorded</p>
                          )}
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-widest text-muted mb-1">Cards</p>
                          {fixture.events.filter((event) => event.type === 'yellow' || event.type === 'red').length >
                          0 ? (
                            <ul className="space-y-1">
                              {fixture.events
                                .filter((event) => event.type === 'yellow' || event.type === 'red')
                                .map((event) => (
                                  <li key={event.id} className="text-ink-soft flex items-center gap-1.5">
                                    <span
                                      aria-hidden="true"
                                      className={`inline-block w-2.5 h-3.5 ${
                                        event.type === 'yellow' ? 'bg-accent' : 'bg-primary'
                                      }`}
                                    />
                                    {event.minute}&apos; {event.playerName}
                                    <span className="sr-only">{event.type} card</span>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-muted">No cards recorded</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === 'scorers' ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Top scorers</h2>
              <p className="mt-1 text-sm text-body">Goals and assists across the season.</p>

              <div className="mt-4 rl-card p-4 sm:p-6">
                {scorers.length === 0 ? (
                  <p className="text-sm text-body">Scorer lists fill up once results are entered.</p>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="min-w-[520px] px-4 sm:px-0">
                      <table className="rl-table">
                        <caption className="sr-only">Top scorers with goals and assists</caption>
                        <thead>
                          <tr>
                            <th scope="col" className="w-12">Rank</th>
                            <th scope="col">Player</th>
                            <th scope="col">Team</th>
                            <th scope="col" className="text-center">Goals</th>
                            <th scope="col" className="text-center">Assists</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scorers.map((scorer, index) => (
                            <tr key={scorer.playerId}>
                              <td className="font-black text-ink">{index + 1}</td>
                              <td className="font-bold text-ink">{scorer.name}</td>
                              <td>
                                <Link href={`/team/${scorer.teamSlug}`} className="hover:text-primary">
                                  {scorer.teamName}
                                </Link>
                              </td>
                              <td className="text-center font-black">{scorer.goals}</td>
                              <td className="text-center">{scorer.assists}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === 'referees' ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Referees</h2>
              <p className="mt-1 text-sm text-body">Appointments for the upcoming fixtures in this league.</p>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rl-card p-4 sm:p-6">
                  <h3 className="text-lg font-black text-ink flex items-center gap-2">
                    <Users size={18} aria-hidden="true" />
                    Panel
                  </h3>
                  <ul className="mt-3 divide-y divide-line">
                    {referees.map((referee) => {
                      const assigned = upcoming.filter((fixture) => fixture.referee === referee.name).length
                      return (
                        <li key={referee.id} className="py-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-ink">{referee.name}</p>
                            <p className="text-xs text-muted">
                              {referee.level}, {referee.county} County
                            </p>
                          </div>
                          <span className="pill pill-completed">
                            {assigned} {assigned === 1 ? 'fixture' : 'fixtures'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="rl-card p-4 sm:p-6">
                  <h3 className="text-lg font-black text-ink flex items-center gap-2">
                    <CalendarDays size={18} aria-hidden="true" />
                    Upcoming appointments
                  </h3>
                  {upcoming.length === 0 ? (
                    <p className="mt-3 text-sm text-body">No upcoming fixtures are published yet.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-line">
                      {upcoming.slice(0, 8).map((fixture) => (
                        <li key={fixture.id} className="py-3">
                          <p className="text-sm font-bold text-ink">
                            {teamName(fixture.homeSlug)} vs {teamName(fixture.awaySlug)}
                          </p>
                          <p className="text-xs text-muted">
                            {formatDayMonth(fixture.kickoff)} at {formatTime(fixture.time)}, {fixture.venue}
                          </p>
                          <p className="text-xs text-ink-soft mt-0.5">Referee: {fixture.referee}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
