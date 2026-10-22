import { NextResponse } from 'next/server'
import { apiError, reference, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { tournamentSchema } from '@/lib/validation'
import { saveTournamentRegistration } from '@/lib/store'
import { sendTournamentConfirmation } from '@/lib/mailer'
import { formatDate } from '@/lib/format'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the registration as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('We could not verify the reCAPTCHA check. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = tournamentSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const id = reference('RL')
  const entry = {
    id,
    ...parsed.data,
    notes: parsed.data.notes ?? '',
    createdAt: new Date().toISOString(),
  }

  await saveTournamentRegistration(entry)
  const mail = await sendTournamentConfirmation({
    to: parsed.data.email,
    organiserName: parsed.data.organiserName,
    tournamentName: parsed.data.tournamentName,
    sport: parsed.data.sport,
    county: parsed.data.county,
    startDate: formatDate(parsed.data.startDate),
  })

  return NextResponse.json({ id, emailSent: mail.sent }, { status: 201 })
}
