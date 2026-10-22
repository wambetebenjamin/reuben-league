import { NextResponse } from 'next/server'
import { apiError, requireAdmin, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { fixtureSchema } from '@/lib/validation'
import { createFixture, getTeams } from '@/lib/store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the fixture as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('reCAPTCHA verification failed. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = fixtureSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const values = parsed.data
  const teams = await getTeams(values.leagueSlug)
  const home = teams.find((team) => team.slug === values.homeSlug)
  const away = teams.find((team) => team.slug === values.awaySlug)

  if (!home || !away) {
    return apiError('Both teams must belong to the selected league.', 422)
  }

  const id = `admin-${Date.now().toString(36)}`

  const fixture = await createFixture({
    id,
    leagueSlug: values.leagueSlug,
    round: 1,
    homeSlug: values.homeSlug,
    awaySlug: values.awaySlug,
    kickoff: values.date,
    time: values.time,
    venue: values.venue,
    referee: values.referee,
    status: 'Upcoming',
    homeScore: null,
    awayScore: null,
    events: [],
    stats: null,
  })

  return NextResponse.json({ fixture }, { status: 201 })
}
