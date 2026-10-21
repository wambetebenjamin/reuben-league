'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { RecaptchaChallenge, useRecaptcha } from '@/components/forms/recaptcha'
import { fixtureSchema } from '@/lib/validation'
import { postJson } from '@/lib/client'
import type { League, Team } from '@/lib/types'

interface FixtureFormProps {
  leagues: League[]
  teams: Team[]
}

export function FixtureForm({ leagues, teams }: FixtureFormProps) {
  const executeRecaptcha = useRecaptcha()
  const [leagueSlug, setLeagueSlug] = useState(leagues[0]?.slug ?? '')
  const [homeSlug, setHomeSlug] = useState('')
  const [awaySlug, setAwaySlug] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('15:00')
  const [venue, setVenue] = useState('')
  const [referee, setReferee] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const leagueTeams = useMemo(
    () => teams.filter((team) => team.leagueSlug === leagueSlug),
    [teams, leagueSlug],
  )

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)
    setSuccess(null)

    const parsed = fixtureSchema.safeParse({ leagueSlug, homeSlug, awaySlug, date, time, venue, referee })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? 'form')] = issue.message
      setErrors(next)
      return
    }

    setSubmitting(true)
    const token = v2Token || (await executeRecaptcha('add_fixture'))
    const result = await postJson('/api/admin/fixtures/add', { ...parsed.data, recaptchaToken: token })
    setSubmitting(false)

    if (!result.ok) {
      setServerError(result.error?.message ?? 'Could not save the fixture.')
      if (result.error?.challengeRequired) setChallenge(true)
      return
    }

    setSuccess('Fixture published to the league page and the match centre.')
    setHomeSlug('')
    setAwaySlug('')
    setDate('')
    setVenue('')
    setReferee('')
    setErrors({})
  }

  return (
    <div className="rl-card p-5 sm:p-6 max-w-3xl">
      <h2 className="text-xl font-black text-ink">Fixture details</h2>
      <p className="mt-1 text-sm text-body">
        Pick the league first, then the two teams. The home ground fills in automatically.
      </p>

      <form onSubmit={submit} noValidate className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="fixture-league" label="League" required error={errors.leagueSlug} className="sm:col-span-2">
            <select
              id="fixture-league"
              className="rl-input"
              value={leagueSlug}
              onChange={(event) => {
                setLeagueSlug(event.target.value)
                setHomeSlug('')
                setAwaySlug('')
                setVenue('')
              }}
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.slug} value={league.slug}>
                  {league.name} ({league.sport})
                </option>
              ))}
            </select>
          </Field>

          <Field id="fixture-home" label="Home team" required error={errors.homeSlug}>
            <select
              id="fixture-home"
              className="rl-input"
              value={homeSlug}
              onChange={(event) => {
                setHomeSlug(event.target.value)
                const team = leagueTeams.find((entry) => entry.slug === event.target.value)
                if (team) setVenue(team.homeGround)
              }}
            >
              <option value="">Select the home team</option>
              {leagueTeams.map((team) => (
                <option key={team.slug} value={team.slug}>
                  {team.name}
                </option>
              ))}
            </select>
          </Field>

          <Field id="fixture-away" label="Away team" required error={errors.awaySlug}>
            <select
              id="fixture-away"
              className="rl-input"
              value={awaySlug}
              onChange={(event) => setAwaySlug(event.target.value)}
            >
              <option value="">Select the away team</option>
              {leagueTeams
                .filter((team) => team.slug !== homeSlug)
                .map((team) => (
                  <option key={team.slug} value={team.slug}>
                    {team.name}
                  </option>
                ))}
            </select>
          </Field>

          <Field id="fixture-date" label="Date" required error={errors.date}>
            <input
              id="fixture-date"
              type="date"
              className="rl-input"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>

          <Field id="fixture-time" label="Kick off time" required error={errors.time} hint="24 hour clock">
            <input
              id="fixture-time"
              type="time"
              className="rl-input"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </Field>

          <Field id="fixture-venue" label="Venue" required error={errors.venue}>
            <input
              id="fixture-venue"
              className="rl-input"
              value={venue}
              placeholder="e.g. Camp Toyoyo, Jericho"
              onChange={(event) => setVenue(event.target.value)}
            />
          </Field>

          <Field id="fixture-referee" label="Referee" required error={errors.referee}>
            <input
              id="fixture-referee"
              className="rl-input"
              value={referee}
              placeholder="e.g. Patrick Oduor"
              onChange={(event) => setReferee(event.target.value)}
            />
          </Field>
        </div>

        {challenge ? <RecaptchaChallenge onToken={setV2Token} /> : null}

        {serverError ? (
          <p className="mt-4 text-sm font-bold text-primary" role="alert">
            {serverError}
          </p>
        ) : null}

        {success ? (
          <p className="mt-4 flex items-center gap-2 text-sm font-bold text-brand-green" role="status">
            <CheckCircle2 size={16} aria-hidden="true" />
            {success}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <button type="submit" disabled={submitting} className="btn btn-primary min-h-[48px] px-6 rounded-none">
            {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            {submitting ? 'Publishing' : 'Add fixture'}
          </button>
          <p className="text-xs text-muted">Protected by reCAPTCHA v3. Validated again on the server.</p>
        </div>
      </form>
    </div>
  )
}
