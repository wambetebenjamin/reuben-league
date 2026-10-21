'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'reuben-league-cookie-consent'

interface Preferences {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  savedAt: string
}

const DEFAULT_PREFERENCES: Preferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
  savedAt: '',
}

const CATEGORIES = [
  {
    key: 'necessary' as const,
    title: 'Necessary',
    description:
      'Required for the site to work: session cookies for the admin dashboard, security checks and your cookie choice. These cannot be switched off.',
    locked: true,
  },
  {
    key: 'functional' as const,
    title: 'Functional',
    description:
      'Remember choices such as which league tab you were reading and whether you have already heard the voice tour.',
    locked: false,
  },
  {
    key: 'analytics' as const,
    title: 'Analytics',
    description:
      'Aggregated page and fixture views through Vercel Analytics so organisers can see which leagues people follow. No personal profiles.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    title: 'Marketing',
    description:
      'Used only if Reuben League promotes a tournament to you. Off by default and never shared with ad networks.',
    locked: false,
  },
]

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Preferences
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
        return
      }
    } catch {
      // storage unavailable, show the banner
    }
    const timer = window.setTimeout(() => setVisible(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modalOpen])

  const persist = (next: Preferences) => {
    const value = { ...next, necessary: true as const, savedAt: new Date().toISOString() }
    setPreferences(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // ignore storage failures
    }
    setVisible(false)
    setModalOpen(false)
  }

  if (!visible) return null

  return (
    <>
      <div
        role="region"
        aria-label="Cookie consent"
        className="pb-safe bottom-0 fixed left-0 right-0 z-[9999] bg-white border-t-2 border-line shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.2)]"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <p className="text-sm text-ink-soft flex-1">
              We use cookies to keep your admin session secure, remember your preferences and count which leagues
              people follow. Read our{' '}
              <Link href="/legal/cookie-policy" className="text-primary underline">
                cookie policy
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy-policy" className="text-primary underline">
                privacy policy
              </Link>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-outline-black min-h-[44px] px-5 rounded-none"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={() => persist({ ...preferences, functional: true, analytics: true })}
                className="btn btn-primary min-h-[44px] px-5 rounded-none"
              >
                Accept All
              </button>
            </div>
          </div>
          <div className="h-3" />
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
          <button
            type="button"
            aria-label="Close cookie preferences"
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="relative w-full sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto border-t-2 sm:border-2 border-line"
          >
            <div className="flex items-start justify-between px-5 pt-5">
              <h2 id="cookie-preferences-title" className="text-xl font-black">
                Cookie preferences
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close cookie preferences"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-ink"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="px-5 mt-1 text-sm">
              Choose what Reuben League may store on this device. Necessary cookies stay on so the site and the admin
              dashboard keep working. We handle all data under the Kenya Data Protection Act, 2019.
            </p>

            <div className="px-5 py-4 space-y-4">
              {CATEGORIES.map((category) => (
                <div key={category.key} className="border-b border-line pb-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor={`cookie-${category.key}`} className="text-base font-bold text-ink">
                      {category.title}
                    </label>
                    <input
                      id={`cookie-${category.key}`}
                      type="checkbox"
                      checked={category.locked ? true : preferences[category.key]}
                      disabled={category.locked}
                      onChange={(event) =>
                        setPreferences((current) => ({ ...current, [category.key]: event.target.checked }))
                      }
                      className="w-5 h-5 accent-[#f23a2e]"
                    />
                  </div>
                  <p className="text-sm mt-1">{category.description}</p>
                  {category.locked ? (
                    <p className="text-xs font-bold uppercase tracking-wide text-muted mt-1">Always on</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => persist({ ...preferences, functional: false, analytics: false, marketing: false })}
                className="btn btn-outline-black min-h-[44px] px-5 rounded-none flex-1"
              >
                Reject optional
              </button>
              <button
                type="button"
                onClick={() => persist(preferences)}
                className="btn btn-primary min-h-[44px] px-5 rounded-none flex-1"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
