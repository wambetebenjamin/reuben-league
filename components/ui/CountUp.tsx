'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface CountUpProps {
  value: number
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      element.textContent = String(value)
      return
    }

    const counter = { current: 0 }
    const tween = gsap.to(counter, {
      current: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = String(Math.round(counter.current))
      },
      onComplete: () => {
        element.textContent = String(value)
      },
    })

    return () => {
      tween.kill()
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      0
    </span>
  )
}
