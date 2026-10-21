import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LeagueCard } from '@/components/LeagueCard'
import { LeagueFilters } from '@/components/leagues/LeagueFilters'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getLeagues } from '@/lib/store'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Leagues directory',
  description:
    'Browse every football, basketball, volleyball, rugby sevens and netball league running on Reuben League across Kenya.',
}

interface LeaguesPageProps {
  searchParams: Promise<{ sport?: string; county?: string; status?: string }>
}

export default async function LeaguesPage({ searchParams }: LeaguesPageProps) {
  const params = await searchParams
  const leagues = await getLeagues()

  const filtered = leagues.filter((league) => {
    if (params.sport && league.sport !== params.sport) return false
    if (params.county && league.county !== params.county) return false
    if (params.status && league.status !== params.status) return false
    return true
  })

  return (
    <div className="site-section">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          subheading="Leagues directory"
          title="Every league on Reuben League"
          description="County tournaments, estate leagues and youth series. Filter by sport, county or status, then open a league for the live table."
        />

        <div className="mt-6">
          <LeagueFilters />
        </div>

        <p className="mt-6 text-sm text-muted" role="status" aria-live="polite">
          Showing {filtered.length} of {leagues.length} leagues
          {params.sport ? ` in ${params.sport}` : ''}
          {params.county ? `, ${params.county} County` : ''}
          {params.status ? `, ${params.status.toLowerCase()}` : ''}.
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 rl-card p-8 text-center">
            <h2 className="text-xl font-black text-ink">No leagues match those filters</h2>
            <p className="mt-2 text-sm">
              Try a different sport or county. If your tournament is not listed yet, register it and our team will set
              it up.
            </p>
            <Link href="/register-tournament" className="btn btn-primary mt-6 min-h-[44px] px-5 rounded-none">
              Register your tournament
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((league) => (
              <LeagueCard key={league.slug} league={league} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
