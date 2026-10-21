import { NextResponse } from 'next/server'
import { apiError, requireAdmin, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { playerSchema } from '@/lib/validation'
import { createPlayer, getTeam } from '@/lib/store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the player as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('reCAPTCHA verification failed. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = playerSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const values = parsed.data
  const team = await getTeam(values.teamSlug)
  if (!team) return apiError('That team does not exist yet. Add the team first.', 422)

  const player = await createPlayer({
    id: `${values.teamSlug}-p${Date.now().toString(36)}`,
    name: values.name,
    teamSlug: values.teamSlug,
    leagueSlug: team.leagueSlug,
    position: values.position,
    jersey: values.jersey,
    dateOfBirth: values.dateOfBirth,
  })

  return NextResponse.json({ player }, { status: 201 })
}
