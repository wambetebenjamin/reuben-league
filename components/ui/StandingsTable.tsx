'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { formatGoalDifference } from '@/lib/format'
import type { StandingRow } from '@/lib/types'

interface StandingsTableProps {
  rows: StandingRow[]
  showGoalColumns?: boolean
  showHint?: boolean
  highlightTop?: number
}

export function StandingsTable({
  rows,
  showGoalColumns = true,
  showHint = true,
  highlightTop = 3,
}: StandingsTableProps) {
  const bodyRef = useRef<HTMLTableSectionElement>(null)

  useEffect(() => {
    const element = bodyRef.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)
    const rows = element.querySelectorAll('tr')
    if (rows.length === 0) return

    const animation = gsap.fromTo(
      rows,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      },
    )

    return () => {
      animation.scrollTrigger?.kill()
      animation.kill()
    }
  }, [rows.length])

  return (
    <div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[600px] px-4 sm:px-0">
          <table className="rl-table">
            <caption className="sr-only">
              League standings: position, team, played, won, drawn, lost, goals, goal difference and points
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-10">#</th>
                <th scope="col">Team</th>
                <th scope="col" className="text-center">P</th>
                <th scope="col" className="text-center">W</th>
                <th scope="col" className="text-center">D</th>
                <th scope="col" className="text-center">L</th>
                {showGoalColumns ? (
                  <>
                    <th scope="col" className="text-center">GF</th>
                    <th scope="col" className="text-center">GA</th>
                  </>
                ) : null}
                <th scope="col" className="text-center">GD</th>
                <th scope="col" className="text-center">Pts</th>
              </tr>
            </thead>
            <tbody ref={bodyRef}>
              {rows.map((row) => (
                <tr key={row.teamSlug}>
                  <td className="text-center font-bold text-ink">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-black ${
                        row.position <= highlightTop ? 'bg-primary text-white' : 'bg-surface text-ink-soft'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="font-bold text-ink">
                    <Link
                      href={`/team/${row.teamSlug}`}
                      className="inline-flex items-center min-h-[44px] hover:text-primary transition-colors"
                    >
                      {row.teamName}
                    </Link>
                  </td>
                  <td className="text-center">{row.played}</td>
                  <td className="text-center">{row.won}</td>
                  <td className="text-center">{row.drawn}</td>
                  <td className="text-center">{row.lost}</td>
                  {showGoalColumns ? (
                    <>
                      <td className="text-center">{row.goalsFor}</td>
                      <td className="text-center">{row.goalsAgainst}</td>
                    </>
                  ) : null}
                  <td className="text-center">{formatGoalDifference(row.goalDifference)}</td>
                  <td className="text-center font-black text-ink">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showHint ? (
        <p className="text-xs text-center mt-2 opacity-60 sm:hidden">Scroll left to see full table</p>
      ) : null}
    </div>
  )
}
