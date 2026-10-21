import Link from 'next/link'
import { ArrowRight, CalendarPlus, PlusCircle, Trophy, UserPlus, Users } from 'lucide-react'
import { AdminTrendChart } from '@/components/charts/AdminTrendChart'
import { CountUp } from '@/components/ui/CountUp'
import { StatusPill } from '@/components/ui/StatusPill'
import { getAdminOverview } from '@/lib/queries'
import { getReferees } from '@/lib/store'
import { formatDate, formatDayMonth, formatTime } from '@/lib/format'

export const revalidate = 0

const QUICK_LINKS = [
  { href: '/admin/leagues/new', label: 'Create league', icon: PlusCircle },
  { href: '/admin/teams/add', label: 'Add team', icon: Users },
  { href: '/admin/fixtures/add', label: 'Add fixture', icon: CalendarPlus },
  { href: '/admin/results/enter', label: 'Enter result', icon: Trophy },
  { href: '/admin/players/add', label: 'Add player', icon: UserPlus },
]

export default async function AdminDashboardPage() {
  const [overview, referees] = await Promise.all([getAdminOverview(), getReferees()])
  const teamNames = new Map(overview.leagues.map((league) => [league.slug, league.name]))

  const summary = [
    { label: 'Active leagues', value: overview.activeLeagues, hint: 'Published and in season' },
    { label: 'Total teams', value: overview.totalTeams, hint: 'Across every league' },
    { label: 'Matches this week', value: overview.matchesThisWeek, hint: 'Kick off within 7 days' },
    { label: 'Upcoming fixtures', value: overview.upcomingFixtures, hint: 'Awaiting a result' },
  ]

  const upcoming = overview.fixtures
    .filter((fixture) => fixture.status !== 'Full Time')
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-black uppercase tracking-widest text-primary">Matchday operations</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-ink">Admin dashboard</h1>
        <p className="mt-1 text-sm text-body">
          Everything running today across Reuben League.{' '}
          {overview.weeks[0] ? `Season data starts ${formatDate(overview.weeks[0].week)}.` : null}
        </p>
      </header>

      <section aria-label="Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((card) => (
          <div key={card.label} className="bg-white border border-line p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-ink">
              <CountUp value={card.value} />
            </p>
            <p className="mt-1 text-xs text-body">{card.hint}</p>
          </div>
        ))}
      </section>

      <section aria-label="Quick actions" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 min-h-[48px] px-4 bg-white border border-line text-sm font-bold text-ink hover:border-primary hover:text-primary transition-colors"
          >
            <link.icon size={16} aria-hidden="true" />
            {link.label}
          </Link>
        ))}
      </section>

      <section id="reports" className="bg-white border border-line p-4 sm:p-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-ink">Matches per week</h2>
            <p className="text-sm text-body">Scheduled fixtures against results entered, by matchday.</p>
          </div>
          <p className="text-xs text-muted">{overview.fixtures.length} fixtures on the platform</p>
        </div>
        <div className="mt-4">
          <AdminTrendChart data={overview.weeks} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-line p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-black text-ink">Leagues</h2>
            <Link href="/admin/leagues/new" className="text-xs font-black uppercase tracking-widest text-primary">
              New league
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {overview.leagues.map((league) => (
              <li key={league.slug} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/league/${league.slug}`} className="text-sm font-bold text-ink hover:text-primary truncate block">
                    {league.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {league.sport}, {league.county} County, {league.teamCount} teams
                  </p>
                </div>
                <StatusPill status={league.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-line p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-black text-ink">Next fixtures</h2>
          <ul className="mt-4 divide-y divide-line">
            {upcoming.map((fixture) => (
              <li key={fixture.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink">
                    {fixture.homeSlug.replace(/-/g, ' ')} vs {fixture.awaySlug.replace(/-/g, ' ')}
                  </p>
                  <span className="text-xs text-muted whitespace-nowrap">{formatTime(fixture.time)}</span>
                </div>
                <p className="text-xs text-muted">
                  {formatDayMonth(fixture.kickoff)}, {teamNames.get(fixture.leagueSlug)}. Referee {fixture.referee}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/fixtures/add"
            className="mt-4 inline-flex items-center gap-2 min-h-[44px] text-xs font-black uppercase tracking-widest text-ink hover:text-primary"
          >
            Add a fixture
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="referees" className="bg-white border border-line p-4 sm:p-6 scroll-mt-24">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-ink">Referee panel</h2>
            <p className="text-sm text-body">Appointments are published with each fixture.</p>
          </div>
          <span className="pill pill-completed">{referees.length} officials</span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {referees.slice(0, 9).map((referee) => (
            <div key={referee.id} className="border border-line p-3">
              <p className="text-sm font-bold text-ink">{referee.name}</p>
              <p className="text-xs text-muted">
                {referee.level}, {referee.county} County
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
