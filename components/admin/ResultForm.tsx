'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2, Plus, Trash2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { RecaptchaChallenge, useRecaptcha } from '@/components/forms/recaptcha'
import { resultSchema } from '@/lib/validation'
import { postJson } from '@/lib/client'
import type { Fixture, Team } from '@/lib/types'

interface ResultFormProps {
  fixtures: Fixture[]
  teams: Team[]
}

interface ScorerRow {
  playerName: string
  minute: string
  type: 'goal' | 'penalty' | 'own goal'
  team: 'home' | 'away'
}

interface CardRow {
  playerName: string
  minute: string
  type: 'yellow' | 'red'
  team: 'home' | 'away'
}

export function ResultForm({ fixtures, teams }: ResultFormProps) {
  const executeRecaptcha = useRecaptcha()
  const [fixtureId, setFixtureId] = useState('')
  const [homeScore, setHomeScore] = useState('0')
  const [awayScore, setAwayScore] = useState('0')
  const [scorers, setScorers] = useState<ScorerRow[]>([])
  const [cards, setCards] = useState<CardRow[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const teamNames = useMemo(() => new Map(teams.map((team) => [team.slug, team.name])), [teams])
  const fixture = fixtures.find((entry) => entry.id === fixtureId)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)
    setSuccess(null)

    const parsed = resultSchema.safeParse({
      fixtureId,
      homeScore,
      awayScore,
      scorers: scorers.map((row) => ({
        playerName: row.playerName,
        minute: row.minute,
        type: row.type,
        team: row.team,
      })),
      cards: cards.map((row) => ({
        playerName: row.playerName,
        minute: row.minute,
        type: row.type,
        team: row.team,
      })),
    })

    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? 'form')] = issue.message
      setErrors(next)
      return
    }

    setSubmitting(true)
    const token = v2Token || (await executeRecaptcha('enter_result'))
    const result = await postJson('/api/admin/results/enter', { ...parsed.data, recaptchaToken: token })
    setSubmitting(false)

    if (!result.ok) {
      setServerError(result.error?.message ?? 'Could not save the result.')
      if (result.error?.challengeRequired) setChallenge(true)
      return
    }

    setSuccess('Result saved. Standings, top scorers and team form have been recalculated.')
    setFixtureId('')
    setHomeScore('0')
    setAwayScore('0')
    setScorers([])
    setCards([])
    setErrors({})
  }

  return (
    <div className="rl-card p-5 sm:p-6 max-w-4xl">
      <h2 className="text-xl font-black text-ink">Match result</h2>
      <p className="mt-1 text-sm text-body">
        Choose the fixture, then add goals and cards. The table updates as soon as you save.
      </p>

      <form onSubmit={submit} noValidate className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field id="result-fixture" label="Fixture" required error={errors.fixtureId} className="sm:col-span-3">
            <select
              id="result-fixture"
              className="rl-input"
              value={fixtureId}
              onChange={(event) => setFixtureId(event.target.value)}
            >
              <option value="">Select a fixture</option>
              {fixtures.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {teamNames.get(entry.homeSlug) ?? entry.homeSlug} vs {teamNames.get(entry.awaySlug) ?? entry.awaySlug}{' '}
                  ({entry.kickoff})
                </option>
              ))}
            </select>
          </Field>

          <Field id="result-home-score" label="Home score" required error={errors.homeScore}>
            <input
              id="result-home-score"
              type="number"
              min={0}
              max={99}
              className="rl-input"
              value={homeScore}
              onChange={(event) => setHomeScore(event.target.value)}
            />
          </Field>

          <Field id="result-away-score" label="Away score" required error={errors.awayScore}>
            <input
              id="result-away-score"
              type="number"
              min={0}
              max={99}
              className="rl-input"
              value={awayScore}
              onChange={(event) => setAwayScore(event.target.value)}
            />
          </Field>

          <div className="flex items-end">
            <p className="text-xs text-muted">
              {fixture
                ? `${teamNames.get(fixture.homeSlug)} vs ${teamNames.get(fixture.awaySlug)} at ${fixture.venue}`
                : 'Select a fixture to see the venue'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-ink">Goalscorers</h3>
            <button
              type="button"
              onClick={() =>
                setScorers((rows) => [...rows, { playerName: '', minute: '45', type: 'goal', team: 'home' }])
              }
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 border-2 border-ink text-xs font-black uppercase tracking-widest text-ink"
            >
              <Plus size={14} aria-hidden="true" />
              Add scorer
            </button>
          </div>

          {scorers.length === 0 ? (
            <p className="mt-2 text-xs text-muted">No scorers added yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {scorers.map((row, index) => (
                <li key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end border border-line p-3">
                  <Field id={`scorer-team-${index}`} label="Team">
                    <select
                      id={`scorer-team-${index}`}
                      className="rl-input"
                      value={row.team}
                      onChange={(event) =>
                        setScorers((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, team: event.target.value as 'home' | 'away' } : entry,
                          ),
                        )
                      }
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                  </Field>
                  <Field id={`scorer-name-${index}`} label="Player name">
                    <input
                      id={`scorer-name-${index}`}
                      className="rl-input"
                      value={row.playerName}
                      onChange={(event) =>
                        setScorers((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, playerName: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field id={`scorer-minute-${index}`} label="Minute">
                    <input
                      id={`scorer-minute-${index}`}
                      type="number"
                      min={1}
                      max={120}
                      className="rl-input"
                      value={row.minute}
                      onChange={(event) =>
                        setScorers((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, minute: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field id={`scorer-type-${index}`} label="Type">
                    <select
                      id={`scorer-type-${index}`}
                      className="rl-input"
                      value={row.type}
                      onChange={(event) =>
                        setScorers((rows) =>
                          rows.map((entry, position) =>
                            position === index
                              ? { ...entry, type: event.target.value as ScorerRow['type'] }
                              : entry,
                          ),
                        )
                      }
                    >
                      <option value="goal">Goal</option>
                      <option value="penalty">Penalty</option>
                      <option value="own goal">Own goal</option>
                    </select>
                  </Field>
                  <button
                    type="button"
                    onClick={() => setScorers((rows) => rows.filter((_, position) => position !== index))}
                    aria-label={`Remove scorer ${index + 1}`}
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border-2 border-line text-primary"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-ink">Cards</h3>
            <button
              type="button"
              onClick={() =>
                setCards((rows) => [...rows, { playerName: '', minute: '60', type: 'yellow', team: 'home' }])
              }
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 border-2 border-ink text-xs font-black uppercase tracking-widest text-ink"
            >
              <Plus size={14} aria-hidden="true" />
              Add card
            </button>
          </div>

          {cards.length === 0 ? (
            <p className="mt-2 text-xs text-muted">No cards added yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {cards.map((row, index) => (
                <li key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end border border-line p-3">
                  <Field id={`card-team-${index}`} label="Team">
                    <select
                      id={`card-team-${index}`}
                      className="rl-input"
                      value={row.team}
                      onChange={(event) =>
                        setCards((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, team: event.target.value as 'home' | 'away' } : entry,
                          ),
                        )
                      }
                    >
                      <option value="home">Home</option>
                      <option value="away">Away</option>
                    </select>
                  </Field>
                  <Field id={`card-name-${index}`} label="Player name">
                    <input
                      id={`card-name-${index}`}
                      className="rl-input"
                      value={row.playerName}
                      onChange={(event) =>
                        setCards((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, playerName: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field id={`card-minute-${index}`} label="Minute">
                    <input
                      id={`card-minute-${index}`}
                      type="number"
                      min={1}
                      max={120}
                      className="rl-input"
                      value={row.minute}
                      onChange={(event) =>
                        setCards((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, minute: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field id={`card-type-${index}`} label="Card">
                    <select
                      id={`card-type-${index}`}
                      className="rl-input"
                      value={row.type}
                      onChange={(event) =>
                        setCards((rows) =>
                          rows.map((entry, position) =>
                            position === index ? { ...entry, type: event.target.value as CardRow['type'] } : entry,
                          ),
                        )
                      }
                    >
                      <option value="yellow">Yellow</option>
                      <option value="red">Red</option>
                    </select>
                  </Field>
                  <button
                    type="button"
                    onClick={() => setCards((rows) => rows.filter((_, position) => position !== index))}
                    aria-label={`Remove card ${index + 1}`}
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] border-2 border-line text-primary"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
            {submitting ? 'Saving result' : 'Save result'}
          </button>
          <p className="text-xs text-muted">Goals and cards save with the score and update every table.</p>
        </div>
      </form>
    </div>
  )
}
