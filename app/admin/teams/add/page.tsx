import { AdminFormShell } from '@/components/forms/AdminFormShell'
import { COUNTIES } from '@/lib/data'
import { getLeagues } from '@/lib/store'

export const revalidate = 0

export default async function AddTeamPage() {
  const leagues = await getLeagues()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">Add team</h1>
        <p className="mt-1 text-sm text-body">
          Register a club, its home ground and coach. The team gets a public profile with squad, results and fixtures.
        </p>
      </header>

      <AdminFormShell
        title="Team details"
        description="Teams appear in the standings as soon as the first fixture is played."
        endpoint="/api/admin/teams/add"
        schemaName="team"
        recaptchaAction="add_team"
        submitLabel="Add team"
        successMessage="Team added. Add players to complete the squad list."
        fields={[
          { name: 'name', label: 'Team name', required: true, placeholder: 'e.g. Kayole All Stars' },
          { name: 'homeGround', label: 'Home ground', required: true, placeholder: 'e.g. Kayole Community Ground' },
          { name: 'coach', label: 'Coach name', required: true, placeholder: 'e.g. Brian Ochieng' },
          {
            name: 'county',
            label: 'County',
            type: 'select',
            required: true,
            defaultValue: 'Nairobi',
            options: COUNTIES.map((county) => ({ value: county, label: county })),
          },
          {
            name: 'leagueSlug',
            label: 'League',
            type: 'select',
            required: true,
            options: leagues.map((league) => ({ value: league.slug, label: `${league.name} (${league.sport})` })),
          },
        ]}
      />
    </div>
  )
}
