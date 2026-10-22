'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Target } from 'lucide-react'
import type { ScorerRow } from '@/lib/types'

export function TopScorersStrip({ scorers }: { scorers: ScorerRow[] }) {
  const reduced = useReducedMotion()

  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5 sm:gap-4">
        {scorers.map((scorer, index) => (
          <motion.div
            key={scorer.playerId}
            initial={reduced ? false : { opacity: 0, x: 40 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="w-[230px] sm:w-auto shrink-0 sm:shrink h-full"
          >
            <Link
              href={`/team/${scorer.teamSlug}`}
              className="rl-card block p-4 h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white text-xs font-black">
                  {index + 1}
                </span>
                <Target size={16} className="text-muted" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-bold text-ink leading-snug">{scorer.name}</p>
              <p className="text-xs text-muted truncate">{scorer.teamName}</p>
              <p className="mt-3 text-2xl font-black text-primary">
                {scorer.goals}
                <span className="ml-1 text-xs font-bold uppercase tracking-widest text-muted">
                  {scorer.goals === 1 ? 'goal' : 'goals'}
                </span>
              </p>
              <p className="text-xs text-muted">{scorer.assists} assists</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
