import { NextResponse } from 'next/server'
import { apiError, requireAdmin, slugify, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { leagueSchema } from '@/lib/validation'
import { getLeagues, createLeague } from '@/lib/store'
import { formatSeasonLabel } from '@/lib/format'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the league as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('reCAPTCHA verification failed. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = leagueSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const values = parsed.data
  const existing = await getLeagues()
  let slug = slugify(values.name)
  let suffix = 2
  while (existing.some((league) => league.slug === slug)) {
    slug = `${slugify(values.name)}-${suffix}`
    suffix += 1
  }

  const league = await createLeague({
    slug,
    code: slug.split('-').map((part) => part[0]).join('').slice(0, 5) || 'rll',
    name: values.name,
    sport: values.sport,
    county: values.county,
    season: formatSeasonLabel(values.seasonStart, values.seasonEnd),
    seasonStart: values.seasonStart,
    seasonEnd: values.seasonEnd,
    teamCount: values.teamCount,
    status: new Date(values.seasonStart) > new Date() ? 'Upcoming' : 'Active',
    organiser: values.organiser || 'Reuben League',
    venue: `${values.county} County`,
    blurb: values.description || `${values.sport} league in ${values.county} County.`,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ league }, { status: 201 })
}
