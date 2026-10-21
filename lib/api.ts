import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'
import { auth } from '@/auth'

export function apiError(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json({ error: message, ...extra }, { status })
}

export function zodFields(error: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    fields[key] = [...(fields[key] ?? []), issue.message]
  }
  return fields
}

export function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      error: 'Some fields need attention. Check the highlighted inputs and try again.',
      fieldErrors: zodFields(error),
    },
    { status: 422 },
  )
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { session: null, response: apiError('Sign in with an admin account to continue.', 401) }
  }
  if (session.user.role !== 'admin') {
    return { session: null, response: apiError('This account does not have admin access.', 403) }
  }
  return { session, response: null }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export function reference(prefix: string): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${stamp}-${random}`
}
