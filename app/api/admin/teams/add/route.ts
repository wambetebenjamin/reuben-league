import { NextResponse } from 'next/server'
import { apiError, requireAdmin, slugify, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { teamSchema } from '@/lib/validation'
import { createTeam, getTeams } from '@/lib/store'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the team as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('reCAPTCHA verification failed. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = teamSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const values = parsed.data
  const existing = await getTeams()
  let slug = slugify(values.name)
  let suffix = 2
  while (existing.some((team) => team.slug === slug)) {
    slug = `${slugify(values.name)}-${suffix}`
    suffix += 1
  }

  const team = await createTeam({
    slug,
    name: values.name,
    leagueSlug: values.leagueSlug,
    homeGround: values.homeGround,
    coach: values.coach,
    county: values.county,
    founded: new Date().getUTCFullYear(),
  })

  return NextResponse.json({ team }, { status: 201 })
}
