import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Trophy, UserRound } from 'lucide-react'
import { TeamBadge } from '@/components/ui/TeamBadge'
import { FormBadges } from '@/components/team/FormBadges'
import { getTeamProfile } from '@/lib/queries'
import { formatDayMonth, formatShortDate, formatTime } from '@/lib/format'

export const revalidate = 0

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getTeamProfile(slug)
  if (!profile) return { title: 'Team not found' }
  return {
    title: profile.team.name,
    description: `${profile.team.name}: squad list, recent results and upcoming fixtures in the ${profile.league?.name ?? 'league'}.`,
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params
  const profile = await getTeamProfile(slug)
  if (!profile) notFound()

  const { team, league, squad, recentResults, upcoming, position, teams } = profile
  const teamMap = new Map(teams.map((entry) => [entry.slug, entry]))
  const teamName = (value: string) => teamMap.get(value)?.name ?? value

  return (
    <>
      <section className="bg-surface-2 border-b border-line">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href={league ? `/league/${league.slug}` : '/leagues'}
            className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-muted hover:text-primary"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {league ? league.name : 'All leagues'}
          </Link>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-5">
            <TeamBadge name={team.name} seed={team.slug} size={84} />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-black text-ink leading-tight">{team.name}</h1>
              <p className="mt-1 text-sm text-body">
                {league ? `${league.sport}, ${league.county} County` : 'Community team'}
                {position > 0 ? `, currently ${position} in the table` : ''}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <MapPin size={15} className="text-muted" aria-hidden="true" />
                  {team.homeGround}
                </span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <UserRound size={15} className="text-muted" aria-hidden="true" />
                  Coach {team.coach}
                </span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <Trophy size={15} className="text-muted" aria-hidden="true" />
                  Founded {team.founded}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Form</p>
              <div className="mt-1">
                <FormBadges form={profile.form} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink">Squad list</h2>
                <p className="mt-1 text-sm text-body">
                  {squad.length} registered players. Goals and cards update from every entered result.
                </p>
              </div>
              <p className="text-xs text-muted">Jersey numbers as registered with the league.</p>
            </div>

            <div className="mt-4 rl-card p-4 sm:p-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[500px] px-4 sm:px-0">
                  <table className="rl-table">
                    <caption className="sr-only">Squad list with positions, jersey numbers, goals and cards</caption>
                    <thead>
                      <tr>
                        <th scope="col">Player</th>
                        <th scope="col">Position</th>
                        <th scope="col" className="text-center">Jersey</th>
                        <th scope="col" className="text-center">Goals</th>
                        <th scope="col" className="text-center">Yellow</th>
                        <th scope="col" className="text-center">Red</th>
                      </tr>
                    </thead>
                    <tbody>
                      {squad.map((entry) => (
                        <tr key={entry.player.id}>
                          <td className="font-bold text-ink">{entry.player.name}</td>
                          <td>{entry.player.position}</td>
                          <td className="text-center font-black">{entry.player.jersey}</td>
                          <td className="text-center">{entry.goals}</td>
                          <td className="text-center">{entry.yellowCards}</td>
                          <td className="text-center">{entry.redCards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-center mt-2 opacity-60 sm:hidden">Scroll left to see full table</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Recent results</h2>
              <p className="mt-1 text-sm text-body">Last five completed matches.</p>

              {recentResults.length === 0 ? (
                <div className="mt-4 rl-card p-5">
                  <p className="text-sm text-body">No completed matches yet this season.</p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentResults.map((fixture) => {
                    const isHome = fixture.homeSlug === team.slug
                    const own = (isHome ? fixture.homeScore : fixture.awayScore) ?? 0
                    const other = (isHome ? fixture.awayScore : fixture.homeScore) ?? 0
                    const outcome = own > other ? 'W' : own < other ? 'L' : 'D'

                    return (
                      <li key={fixture.id} className="rl-card p-4">
                        <Link href={`/match/${fixture.id}`} className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black text-white shrink-0 ${
                              outcome === 'W' ? 'bg-brand-green' : outcome === 'L' ? 'bg-primary' : 'bg-chip'
                            }`}
                            aria-label={outcome === 'W' ? 'Won' : outcome === 'L' ? 'Lost' : 'Drew'}
                          >
                            {outcome}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink truncate">
                              {isHome ? 'vs' : 'at'} {teamName(isHome ? fixture.awaySlug : fixture.homeSlug)}
                            </p>
                            <p className="text-xs text-muted">
                              {formatDayMonth(fixture.kickoff)}, round {fixture.round}
                            </p>
                          </div>
                          <span className="text-lg font-black text-ink whitespace-nowrap">
                            {own} <span className="text-muted font-light">-</span> {other}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">Upcoming fixtures</h2>
              <p className="mt-1 text-sm text-body">Next three matches on the calendar.</p>

              {upcoming.length === 0 ? (
                <div className="mt-4 rl-card p-5">
                  <p className="text-sm text-body">No upcoming fixtures are published for this team.</p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {upcoming.map((fixture) => {
                    const isHome = fixture.homeSlug === team.slug
                    return (
                      <li key={fixture.id} className="rl-card p-4">
                        <Link href={`/match/${fixture.id}`}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-ink">
                              {isHome ? 'vs' : 'at'} {teamName(isHome ? fixture.awaySlug : fixture.homeSlug)}
                            </p>
                            <span className="pill pill-upcoming">Round {fixture.round}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            {formatShortDate(fixture.kickoff)} at {formatTime(fixture.time)}, {fixture.venue}
                          </p>
                          <p className="text-xs text-muted">Referee {fixture.referee}</p>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
