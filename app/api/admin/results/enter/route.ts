import { NextResponse } from 'next/server'
import { apiError, requireAdmin, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { resultSchema } from '@/lib/validation'
import { getFixture, saveResult } from '@/lib/store'
import type { MatchEvent } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { response } = await requireAdmin()
  if (response) return response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the result as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('reCAPTCHA verification failed. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = resultSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const values = parsed.data
  const fixture = await getFixture(values.fixtureId)
  if (!fixture) return apiError('That fixture was not found.', 404)

  const teamFor = (side: 'home' | 'away') => (side === 'home' ? fixture.homeSlug : fixture.awaySlug)

  const scorerEvents: MatchEvent[] = (values.scorers ?? []).map((scorer, index) => ({
    id: `${fixture.id}-admin-g${index}`,
    type: scorer.type,
    teamSlug: teamFor(scorer.team),
    playerName: scorer.playerName,
    minute: scorer.minute,
  }))

  const cardEvents: MatchEvent[] = (values.cards ?? []).map((card, index) => ({
    id: `${fixture.id}-admin-c${index}`,
    type: card.type,
    teamSlug: teamFor(card.team),
    playerName: card.playerName,
    minute: card.minute,
  }))

  const updated = await saveResult({
    ...fixture,
    status: 'Full Time',
    homeScore: values.homeScore,
    awayScore: values.awayScore,
    events: [...scorerEvents, ...cardEvents].sort((a, b) => a.minute - b.minute),
  })

  return NextResponse.json({ fixture: updated }, { status: 200 })
}
