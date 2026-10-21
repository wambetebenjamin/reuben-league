'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const TOUR_SCRIPT =
  'Welcome to Reuben League, the sports management platform built for Kenyan community tournaments. Run your football, basketball, or volleyball league with live standings, fixture schedules, real-time results, and top scorer tables all in one place. Tournament organisers get a full admin dashboard. Fans and players get instant access to every stat. Scroll down to explore the league tables or register your tournament today.'

type TourState = 'idle' | 'speaking' | 'done'

export function VoiceTour() {
  const [state, setState] = useState<TourState>('idle')
  const [supported, setSupported] = useState(true)
  const startedRef = useRef(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(TOUR_SCRIPT)
    utterance.rate = 0.95
    utterance.pitch = 1.1
    utterance.lang = 'en-KE'
    utterance.onstart = () => setState('speaking')
    utterance.onend = () => setState('done')
    utterance.onerror = () => setState('done')
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }

    const startOnce = () => {
      if (startedRef.current) return
      if (window.scrollY > 80) {
        startedRef.current = true
        speak()
      }
    }

    const onClick = () => {
      if (startedRef.current) return
      startedRef.current = true
      speak()
    }

    window.addEventListener('scroll', startOnce, { passive: true })
    window.addEventListener('click', onClick, { once: true })

    return () => {
      window.removeEventListener('scroll', startOnce)
      window.removeEventListener('click', onClick)
      window.speechSynthesis.cancel()
    }
  }, [speak])

  const toggle = () => {
    if (!supported) return
    if (state === 'speaking') {
      window.speechSynthesis.cancel()
      setState('done')
      return
    }
    startedRef.current = true
    speak()
  }

  const label =
    state === 'speaking'
      ? 'Site voice tour, click to mute'
      : state === 'done'
        ? 'Replay tour'
        : 'Site voice tour, hear what this site is about'

  return (
    <div className="fixed left-6 bottom-6 bottom-safe z-[9998]">
      <div className="relative group">
        {state === 'speaking' ? (
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />
        ) : null}
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          title={label}
          aria-pressed={state === 'speaking'}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-ink text-white shadow-lg hover:bg-ink-soft transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {state === 'speaking' || !supported ? (
            <VolumeX size={22} aria-hidden="true" />
          ) : (
            <Volume2 size={22} aria-hidden="true" />
          )}
        </button>
        <span className="pointer-events-none absolute left-0 bottom-16 whitespace-nowrap bg-ink text-white text-xs font-bold px-3 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {state === 'speaking' ? 'Mute the tour' : state === 'done' ? 'Replay tour' : 'Hear what this site is about'}
        </span>
      </div>
    </div>
  )
}
