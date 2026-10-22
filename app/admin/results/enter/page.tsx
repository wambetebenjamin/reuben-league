import { ResultForm } from '@/components/admin/ResultForm'
import { getFixtures, getTeams } from '@/lib/store'

export const revalidate = 0

export default async function EnterResultPage() {
  const [fixtures, teams] = await Promise.all([getFixtures(), getTeams()])
  const openFixtures = fixtures
    .filter((fixture) => fixture.status !== 'Full Time')
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">Enter match result</h1>
        <p className="mt-1 text-sm text-body">
          Save the final score with goalscorers and cards. Standings, goal difference, top scorers and team form update
          automatically.
        </p>
      </header>

      {openFixtures.length === 0 ? (
        <div className="rl-card p-6 max-w-3xl">
          <h2 className="text-lg font-black text-ink">No fixtures awaiting a result</h2>
          <p className="mt-1 text-sm text-body">
            Every published fixture already has a result. Add the next fixture first, then come back here.
          </p>
        </div>
      ) : (
        <ResultForm fixtures={openFixtures} teams={teams} />
      )}
    </div>
  )
}
