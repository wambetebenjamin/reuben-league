export interface RecaptchaResult {
  success: boolean
  score: number
  skipped: boolean
  challengeRequired: boolean
  errorCodes: string[]
}

/**
 * Server side reCAPTCHA verification. RECAPTCHA_SECRET_KEY never reaches the
 * browser. When the key is not configured (local development) requests pass
 * through with a logged warning so the dashboard remains usable.
 */
export async function verifyRecaptcha(token?: string | null): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    return {
      success: true,
      score: 1,
      skipped: true,
      challengeRequired: false,
      errorCodes: ['missing-secret-key'],
    }
  }

  if (!token) {
    return {
      success: false,
      score: 0,
      skipped: false,
      challengeRequired: true,
      errorCodes: ['missing-token'],
    }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
      cache: 'no-store',
    })

    const data = (await response.json()) as {
      success?: boolean
      score?: number
      'error-codes'?: string[]
    }

    const score = typeof data.score === 'number' ? data.score : 1
    const verified = Boolean(data.success)
    return {
      success: verified && score >= 0.5,
      score,
      skipped: false,
      challengeRequired: !verified || score < 0.5,
      errorCodes: data['error-codes'] ?? [],
    }
  } catch {
    return {
      success: false,
      score: 0,
      skipped: false,
      challengeRequired: true,
      errorCodes: ['verification-unreachable'],
    }
  }
}
