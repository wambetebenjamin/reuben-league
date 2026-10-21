'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { RecaptchaChallenge, useRecaptcha } from '@/components/forms/recaptcha'
import { enquirySchema, type EnquiryFormValues } from '@/lib/validation'
import { postJson } from '@/lib/client'

export function EnquiryForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    defaultValues: { name: '', email: '', message: '' },
  })
  const executeRecaptcha = useRecaptcha()
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(false)
  const [v2Token, setV2Token] = useState('')

  const onSubmit = async (values: EnquiryFormValues) => {
    setServerError(null)
    const parsed = enquirySchema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof EnquiryFormValues, { message: issue.message })
      }
      return
    }

    const token = v2Token || (await executeRecaptcha('send_enquiry'))
    const result = await postJson('/api/send-enquiry', { ...parsed.data, recaptchaToken: token })

    if (!result.ok) {
      setServerError(result.error?.message ?? 'We could not send your message. Please try again.')
      if (result.error?.challengeRequired) setChallenge(true)
      return
    }

    setStatus('sent')
    reset()
  }

  if (status === 'sent') {
    return (
      <div className="rl-card p-6">
        <h3 className="text-lg font-black text-ink">Message sent</h3>
        <p className="mt-2 text-sm text-body">
          Thank you. Our team replies to enquiries within one working day. For anything urgent, message us on WhatsApp
          at +254 112 272 061.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn btn-outline-black mt-5 min-h-[44px] px-5 rounded-none"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rl-card p-5 sm:p-6">
      <h3 className="text-lg font-black text-ink">Talk to the Reuben League team</h3>
      <p className="mt-1 text-sm text-body">
        Questions about setting up a league, importing results or training your matchday staff.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="enquiry-name" label="Your name" required error={errors.name?.message}>
          <input
            id="enquiry-name"
            autoComplete="name"
            className="rl-input"
            {...register('name', { required: 'Enter your name' })}
          />
        </Field>
        <Field id="enquiry-email" label="Email address" required error={errors.email?.message}>
          <input
            id="enquiry-email"
            type="email"
            autoComplete="email"
            className="rl-input"
            {...register('email', { required: 'Enter your email address' })}
          />
        </Field>
        <Field
          id="enquiry-message"
          label="Message"
          required
          className="sm:col-span-2"
          error={errors.message?.message}
        >
          <textarea
            id="enquiry-message"
            rows={4}
            className="rl-input"
            placeholder="Tell us what you need help with"
            {...register('message', { required: 'Tell us how we can help' })}
          />
        </Field>
      </div>

      {challenge ? <RecaptchaChallenge onToken={setV2Token} /> : null}

      {serverError ? (
        <p className="mt-4 text-sm font-bold text-primary" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary mt-5 w-full sm:w-auto min-h-[48px] px-6 rounded-none"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}
