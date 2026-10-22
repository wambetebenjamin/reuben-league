'use client'

import { useCallback, useEffect, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render?: (container: HTMLElement, options: Record<string, unknown>) => number
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

function loadScript(id: string, src: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (document.getElementById(id)) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('reCAPTCHA failed to load'))
    document.head.appendChild(script)
  })
}

/**
 * Invisible reCAPTCHA v3. The token is minted at submit time and verified on
 * the server. When Google returns a score below 0.5 the API response asks the
 * form to render the visible v2 challenge instead.
 */
export function useRecaptcha() {
  const ready = useRef(false)

  useEffect(() => {
    if (!SITE_KEY) return
    loadScript('recaptcha-v3', `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`)
      .then(() => {
        window.grecaptcha?.ready(() => {
          ready.current = true
        })
      })
      .catch(() => {
        ready.current = false
      })
  }, [])

  return useCallback(async (action: string): Promise<string> => {
    if (!SITE_KEY || !window.grecaptcha) return ''
    try {
      return await window.grecaptcha.execute(SITE_KEY, { action })
    } catch {
      return ''
    }
  }, [])
}

interface RecaptchaChallengeProps {
  onToken: (token: string) => void
}

export function RecaptchaChallenge({ onToken }: RecaptchaChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)

  useEffect(() => {
    if (!SITE_KEY || rendered.current || !containerRef.current) return
    let cancelled = false

    loadScript('recaptcha-v2', 'https://www.google.com/recaptcha/api.js?render=explicit')
      .then(() => {
        if (cancelled || !containerRef.current || !window.grecaptcha?.render) return
        window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: onToken,
          theme: 'light',
        })
        rendered.current = true
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [onToken])

  if (!SITE_KEY) return null

  return (
    <div className="mt-4 border-2 border-line p-3">
      <p className="text-xs text-ink-soft mb-2">
        We need one quick check that you are human before saving this form.
      </p>
      <div ref={containerRef} />
    </div>
  )
}

export const recaptchaConfigured = Boolean(SITE_KEY)
