'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { RecaptchaChallenge, useRecaptcha } from '@/components/forms/recaptcha'
import { SPORTS, COUNTIES } from '@/lib/data'
import { tournamentSchema, type TournamentFormValues } from '@/lib/validation'
import { postJson } from '@/lib/client'

const DEFAULTS: TournamentFormValues = {
  organiserName: '',
  email: '',
  phone: '',
  tournamentName: '',
  sport: 'Football',
  county: 'Nairobi',
  estimatedTeams: 8,
  startDate: '',
  notes: '',
}

export function TournamentForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TournamentFormValues>({ defaultValues: DEFAULTS })
  const executeRecaptcha = useRecaptcha()
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [reference, setReference] = useState<string | null>(null)

  const onSubmit = async (values: TournamentFormValues) => {
    setServerError(null)
    const parsed = tournamentSchema.safeParse(values)

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TournamentFormValues
        setError(field, { message: issue.message })
      }
      return
    }

    const token = v2Token || (await executeRecaptcha('register_tournament'))
    const result = await postJson<{ id: string }>('/api/tournaments/register', {
      ...parsed.data,
      recaptchaToken: token,
    })

    if (!result.ok) {
      setServerError(result.error?.message ?? 'Registration failed. Please try again.')
      if (result.error?.challengeRequired) setChallenge(true)
      return
    }

    setReference(result.data?.id ?? 'received')
    reset(DEFAULTS)
  }

  if (reference) {
    return (
      <div className="rl-card p-6 sm:p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-brand-green" aria-hidden="true" />
        <h2 className="mt-4 text-xl sm:text-2xl font-black text-ink">Registration received</h2>
        <p className="mt-2 text-sm text-body max-w-md mx-auto">
          Your reference is <strong className="text-ink">{reference}</strong>. We have sent a confirmation to your
          email address and our tournament desk will call you within one working day.
        </p>
        <button
          type="button"
          onClick={() => setReference(null)}
          className="btn btn-outline-black mt-6 min-h-[44px] px-5 rounded-none"
        >
          Register another tournament
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rl-card p-5 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Field id="organiserName" label="Organiser name" required error={errors.organiserName?.message}>
          <input
            id="organiserName"
            autoComplete="name"
            className="rl-input"
            placeholder="e.g. Sarah Wanjiku"
            {...register('organiserName', { required: 'Enter the organiser name' })}
          />
        </Field>

        <Field id="email" label="Email address" required error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="rl-input"
            placeholder="you@example.co.ke"
            {...register('email', { required: 'Enter an email address' })}
          />
        </Field>

        <Field
          id="phone"
          label="Phone number"
          required
          hint="Kenyan mobile number, for example 0712 345 678"
          error={errors.phone?.message}
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="rl-input"
            placeholder="0712 345 678"
            {...register('phone', { required: 'Enter a phone number' })}
          />
        </Field>

        <Field id="tournamentName" label="Tournament name" required error={errors.tournamentName?.message}>
          <input
            id="tournamentName"
            className="rl-input"
            placeholder="e.g. Kawangware Youth Cup"
            {...register('tournamentName', { required: 'Enter the tournament name' })}
          />
        </Field>

        <Field id="sport" label="Sport type" required error={errors.sport?.message}>
          <select id="sport" className="rl-input" {...register('sport', { required: true })}>
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </Field>

        <Field id="county" label="County" required error={errors.county?.message}>
          <select id="county" className="rl-input" {...register('county', { required: true })}>
            {COUNTIES.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="estimatedTeams"
          label="Estimated number of teams"
          required
          error={errors.estimatedTeams?.message}
        >
          <input
            id="estimatedTeams"
            type="number"
            min={2}
            max={128}
            className="rl-input"
            {...register('estimatedTeams', { required: 'Enter how many teams will play', valueAsNumber: true })}
          />
        </Field>

        <Field id="startDate" label="Preferred start date" required error={errors.startDate?.message}>
          <input
            id="startDate"
            type="date"
            className="rl-input"
            {...register('startDate', { required: 'Choose a start date' })}
          />
        </Field>

        <Field
          id="notes"
          label="Additional notes"
          className="sm:col-span-2"
          hint="Venues, number of matchdays, sponsorship or anything else we should know."
          error={errors.notes?.message}
        >
          <textarea id="notes" rows={4} className="rl-input" placeholder="Tell us about the tournament" {...register('notes')} />
        </Field>
      </div>

      {challenge ? <RecaptchaChallenge onToken={setV2Token} /> : null}

      {serverError ? (
        <p className="mt-4 text-sm font-bold text-primary" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full sm:w-auto min-h-[48px] px-6 rounded-none"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? 'Sending registration' : 'Submit registration'}
        </button>
        <p className="text-xs text-muted">
          Protected by reCAPTCHA. We only use these details to set up your league.
        </p>
      </div>
    </form>
  )
}
