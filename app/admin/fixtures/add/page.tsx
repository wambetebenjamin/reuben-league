import { FixtureForm } from '@/components/admin/FixtureForm'
import { getLeagues, getTeams } from '@/lib/store'

export const revalidate = 0

export default async function AddFixturePage() {
  const [leagues, teams] = await Promise.all([getLeagues(), getTeams()])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">Add fixture</h1>
        <p className="mt-1 text-sm text-body">
          Publish a match with its venue and referee. Fixtures appear in the league calendar and the match centre
          immediately.
        </p>
      </header>

      <FixtureForm leagues={leagues} teams={teams} />
    </div>
  )
}
