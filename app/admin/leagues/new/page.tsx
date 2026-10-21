import { AdminFormShell } from '@/components/forms/AdminFormShell'
import { COUNTIES, SPORTS } from '@/lib/data'

export default function NewLeaguePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">Create league</h1>
        <p className="mt-1 text-sm text-body">
          Publish a new competition. The league page, fixtures tab and standings table are created with it.
        </p>
      </header>

      <AdminFormShell
        title="League details"
        description="Season dates control the fixture calendar. Team count is the number of clubs you expect to register."
        endpoint="/api/admin/leagues/create"
        schemaName="league"
        recaptchaAction="create_league"
        submitLabel="Create league"
        successMessage="League created. Add teams and fixtures to publish the first table."
        fields={[
          { name: 'name', label: 'League name', required: true, placeholder: 'e.g. Thika Road Community League' },
          {
            name: 'sport',
            label: 'Sport type',
            type: 'select',
            required: true,
            defaultValue: 'Football',
            options: SPORTS.map((sport) => ({ value: sport, label: sport })),
          },
          {
            name: 'county',
            label: 'County',
            type: 'select',
            required: true,
            defaultValue: 'Nairobi',
            options: COUNTIES.map((county) => ({ value: county, label: county })),
          },
          { name: 'seasonStart', label: 'Season start', type: 'date', required: true },
          { name: 'seasonEnd', label: 'Season end', type: 'date', required: true },
          {
            name: 'teamCount',
            label: 'Number of teams',
            type: 'number',
            required: true,
            min: 2,
            max: 64,
            defaultValue: 12,
          },
          { name: 'organiser', label: 'Organiser', placeholder: 'e.g. Reuben League County Board' },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            fullWidth: true,
            placeholder: 'Short description for the public league page',
          },
        ]}
      />
    </div>
  )
}
