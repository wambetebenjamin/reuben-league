export interface ApiError {
  message: string
  fieldErrors?: Record<string, string[]>
  challengeRequired?: boolean
}

export interface ApiResult<T> {
  ok: boolean
  status: number
  data?: T
  error?: ApiError
}

export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: {
          message: typeof payload.error === 'string' ? payload.error : 'Something went wrong. Please try again.',
          fieldErrors: (payload.fieldErrors as Record<string, string[]>) ?? undefined,
          challengeRequired: Boolean(payload.challengeRequired),
        },
      }
    }

    return { ok: true, status: response.status, data: payload as T }
  } catch {
    return {
      ok: false,
      status: 0,
      error: { message: 'We could not reach the server. Check your connection and try again.' },
    }
  }
}
