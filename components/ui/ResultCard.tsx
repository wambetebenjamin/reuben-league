'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { formatShortDate } from '@/lib/format'
import type { Fixture, Team } from '@/lib/types'

interface ResultCardProps {
  fixture: Fixture
  home?: Team
  away?: Team
  index?: number
}

export function ResultCard({ fixture, home, away, index = 0 }: ResultCardProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, rotateX: -55, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 900 }}
      className="h-full"
    >
      <Link
        href={`/match/${fixture.id}`}
        className="rl-card block p-4 sm:p-5 h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary">
            Round {fixture.round}
          </span>
          <span className="text-xs text-muted">{formatShortDate(fixture.kickoff)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm sm:text-base font-bold text-ink flex-1 leading-snug">
            {home?.name ?? fixture.homeSlug}
          </span>
          <span className="text-xl sm:text-2xl font-black text-ink whitespace-nowrap">
            {fixture.homeScore} <span className="text-muted font-light">-</span> {fixture.awayScore}
          </span>
          <span className="text-sm sm:text-base font-bold text-ink flex-1 text-right leading-snug">
            {away?.name ?? fixture.awaySlug}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={13} aria-hidden="true" />
          <span className="truncate">{fixture.venue}</span>
        </div>
      </Link>
    </motion.div>
  )
}
