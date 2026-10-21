'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'

/**
 * Branded preloader: a football rolls across the screen, the wordmark fades in
 * after the roll, and a live percentage is announced through role="status".
 * Skipped entirely for visitors who ask for reduced motion.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersReduced = media.matches
    setReducedMotion(prefersReduced)

    const started = performance.now()
    setVisible(true)

    const duration = prefersReduced ? 900 : 2200

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - started
      setProgress(Math.min(100, Math.round((elapsed / duration) * 100)))

      const pageReady = document.readyState === 'complete'
      const finishedRolling = elapsed >= duration
      if (finishedRolling && (pageReady || elapsed >= 6000)) {
        setVisible(false)
      }
    }, 80)

    const skipTimer = window.setTimeout(() => setCanSkip(true), 3000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(skipTimer)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading Reuben League, ${progress} percent`}
      className="fixed inset-0 z-[10001] bg-white flex flex-col items-center justify-center px-6"
    >
      {reducedMotion ? (
        <div className="text-center">
          <Logo className="text-2xl" />
          <p className="mt-4 text-sm font-bold text-ink-soft">{progress}% loaded</p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="relative h-16 mb-8">
            <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-line -translate-y-1/2" aria-hidden="true" />
            <svg
              viewBox="0 0 48 48"
              width="44"
              height="44"
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 animate-roll"
            >
              <circle cx="24" cy="24" r="22" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <path d="M24 10l6 4-2 7h-8l-2-7z" fill="#000000" />
              <path d="M12 22l6-3 4 5-3 6-7-1z" fill="#f23a2e" />
              <path d="M36 22l-6-3-4 5 3 6 7-1z" fill="#f23a2e" />
              <path d="M20 38l4-5 4 5-4 4z" fill="#000000" />
            </svg>
          </div>
          <div className="text-center animate-fade-up">
            <Logo className="text-2xl sm:text-3xl" />
            <p className="mt-2 text-sm text-body">Every game counts. Every table is live.</p>
          </div>
          <div className="mt-8 h-[3px] w-full bg-line overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-xs font-bold text-muted">{progress}%</p>
        </div>
      )}

      {canSkip && visible ? (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="mt-8 btn btn-outline-black min-h-[44px] px-5 rounded-none"
        >
          Skip intro
        </button>
      ) : null}
    </div>
  )
}
