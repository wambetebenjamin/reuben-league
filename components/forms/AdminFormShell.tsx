'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { RecaptchaChallenge, useRecaptcha } from '@/components/forms/recaptcha'
import { postJson } from '@/lib/client'
import { leagueSchema, playerSchema, teamSchema } from '@/lib/validation'

export type AdminSchemaName = 'league' | 'team' | 'player'

const SCHEMAS = {
  league: leagueSchema,
  team: teamSchema,
  player: playerSchema,
}

export interface AdminFieldConfig {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'date' | 'time' | 'textarea' | 'select'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  hint?: string
  required?: boolean
  defaultValue?: string | number
  min?: number
  max?: number
  fullWidth?: boolean
}

interface AdminFormShellProps {
  title: string
  description: string
  endpoint: string
  schemaName: AdminSchemaName
  fields: AdminFieldConfig[]
  submitLabel: string
  successMessage: string
  recaptchaAction: string
  onSuccess?: () => void
  extra?: React.ReactNode
}

/**
 * Shared admin form: reCAPTCHA v3 token, Zod validation, POST to the admin API
 * and an inline success panel. Server side does the same checks again.
 */
export function AdminFormShell({
  title,
  description,
  endpoint,
  schemaName,
  fields,
  submitLabel,
  successMessage,
  recaptchaAction,
  onSuccess,
  extra,
}: AdminFormShellProps) {
  const executeRecaptcha = useRecaptcha()
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, field.defaultValue !== undefined ? String(field.defaultValue) : ''])),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const setValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)
    setSuccess(null)

    const numericFields = new Set(fields.filter((field) => field.type === 'number').map((field) => field.name))
    const payload: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(values)) {
      payload[key] = numericFields.has(key) && value !== '' ? Number(value) : value
    }

    const parsed = SCHEMAS[schemaName].safeParse(payload)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const token = v2Token || (await executeRecaptcha(recaptchaAction))
    const result = await postJson<{ message?: string }>(endpoint, { ...parsed.data, recaptchaToken: token })
    setSubmitting(false)

    if (!result.ok) {
      setServerError(result.error?.message ?? 'Could not save. Please try again.')
      if (result.error?.fieldErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(result.error.fieldErrors).map(([key, messages]) => [key, messages[0] ?? '']),
          ),
        )
      }
      if (result.error?.challengeRequired) setChallenge(true)
      return
    }

    setSuccess(successMessage)
    onSuccess?.()
  }

  return (
    <div className="rl-card p-5 sm:p-6 max-w-3xl">
      <h2 className="text-xl sm:text-2xl font-black text-ink">{title}</h2>
      <p className="mt-1 text-sm text-body">{description}</p>

      <form onSubmit={submit} noValidate className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <Field
              key={field.name}
              id={`admin-${field.name}`}
              label={field.label}
              error={errors[field.name]}
              hint={field.hint}
              required={field.required}
              className={field.fullWidth || field.type === 'textarea' ? 'sm:col-span-2' : ''}
            >
              {field.type === 'select' ? (
                <select
                  id={`admin-${field.name}`}
                  className="rl-input"
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                >
                  <option value="">Select an option</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`admin-${field.name}`}
                  rows={4}
                  className="rl-input"
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                />
              ) : (
                <input
                  id={`admin-${field.name}`}
                  type={field.type ?? 'text'}
                  className="rl-input"
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  value={values[field.name] ?? ''}
                  onChange={(event) => setValue(field.name, event.target.value)}
                />
              )}
            </Field>
          ))}
        </div>

        {extra}

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
            {submitting ? 'Saving' : submitLabel}
          </button>
          <p className="text-xs text-muted">Protected by reCAPTCHA v3. Every field is validated on the server.</p>
        </div>
      </form>
    </div>
  )
}
