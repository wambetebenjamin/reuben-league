import { NextResponse } from 'next/server'
import { apiError, reference, validationError } from '@/lib/api'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { enquirySchema } from '@/lib/validation'
import { saveEnquiry } from '@/lib/store'
import { sendEnquiryNotification } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Send the enquiry as JSON.', 400)
  }

  const recaptcha = await verifyRecaptcha((body as { recaptchaToken?: string })?.recaptchaToken)
  if (!recaptcha.success) {
    return apiError('We could not verify the reCAPTCHA check. Please try again.', 403, {
      challengeRequired: recaptcha.challengeRequired,
    })
  }

  const parsed = enquirySchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const id = reference('ENQ')
  await saveEnquiry({ id, ...parsed.data, createdAt: new Date().toISOString() })
  const mail = await sendEnquiryNotification(parsed.data)

  return NextResponse.json({ id, emailSent: mail.sent }, { status: 201 })
}
