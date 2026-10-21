'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { loginSchema } from '@/lib/validation'

interface LoginFormProps {
  googleEnabled: boolean
  callbackUrl?: string
}

export function LoginForm({ googleEnabled, callbackUrl = '/admin' }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setErrors({})

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message
      setErrors(next)
      return
    }

    setSubmitting(true)
    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    setSubmitting(false)

    if (!result || result.error) {
      setMessage('Those details do not match an admin account. Check the email and password.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="rl-card p-6 sm:p-8 max-w-md w-full">
      <h1 className="text-2xl font-black text-ink">Organiser login</h1>
      <p className="mt-1 text-sm text-body">
        Sign in to manage leagues, fixtures, results, squads and referees.
      </p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <Field id="login-email" label="Email address" required error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className="rl-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field id="login-password" label="Password" required error={errors.password}>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="rl-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        {message ? (
          <p className="text-sm font-bold text-primary" role="alert">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full min-h-[48px] rounded-none"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {submitting ? 'Signing in' : 'Sign in'}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px bg-line flex-1" />
            <span className="text-xs uppercase tracking-widest text-muted">or</span>
            <span className="h-px bg-line flex-1" />
          </div>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="btn btn-outline-black w-full min-h-[48px] rounded-none"
          >
            Continue with Google
          </button>
        </>
      ) : null}

      <p className="mt-6 text-xs text-muted">
        Admin access is limited to Reuben League staff and appointed league organisers. Contact hello@reubenleague.co.ke
        if you need an account.
      </p>
    </div>
  )
}
