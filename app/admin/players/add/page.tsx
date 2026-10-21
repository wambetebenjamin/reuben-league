import { AdminFormShell } from '@/components/forms/AdminFormShell'
import { getTeams } from '@/lib/store'

export const revalidate = 0

const POSITIONS = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
  'Guard',
  'Center',
  'Setter',
  'Libero',
  'Outside Hitter',
  'Middle Blocker',
  'Prop',
  'Hooker',
  'Fly-half',
  'Centre',
  'Wing',
  'Fullback',
  'Goal Shooter',
  'Goal Attack',
  'Wing Attack',
  'Centre',
  'Wing Defence',
  'Goal Defence',
  'Goal Keeper',
]

export default async function AddPlayerPage() {
  const teams = await getTeams()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">Add player</h1>
        <p className="mt-1 text-sm text-body">
          Register a squad member with their position and jersey number. Goals and cards build up from entered results.
        </p>
      </header>

      <AdminFormShell
        title="Player details"
        description="Jersey numbers are unique within a team. Use the position that matches the sport."
        endpoint="/api/admin/players/add"
        schemaName="player"
        recaptchaAction="add_player"
        submitLabel="Add player"
        successMessage="Player added to the squad list."
        fields={[
          { name: 'name', label: 'Player name', required: true, placeholder: 'e.g. Dennis Mutua' },
          {
            name: 'teamSlug',
            label: 'Team',
            type: 'select',
            required: true,
            options: teams.map((team) => ({ value: team.slug, label: team.name })),
          },
          {
            name: 'position',
            label: 'Position',
            type: 'select',
            required: true,
            options: [...new Set(POSITIONS)].map((position) => ({ value: position, label: position })),
          },
          { name: 'jersey', label: 'Jersey number', type: 'number', required: true, min: 0, max: 99, defaultValue: 7 },
          { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
        ]}
      />
    </div>
  )
}
