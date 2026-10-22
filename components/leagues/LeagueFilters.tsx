'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { COUNTIES, SPORTS } from '@/lib/data'

const STATUSES = ['Active', 'Upcoming', 'Completed'] as const

export function LeagueFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const sport = searchParams.get('sport') ?? ''
  const county = searchParams.get('county') ?? ''
  const status = searchParams.get('status') ?? ''
  const hasFilters = Boolean(sport || county || status)

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => {
      router.replace(params.toString() ? `/leagues?${params.toString()}` : '/leagues', { scroll: false })
    })
  }

  return (
    <div className="rl-card p-4 sm:p-6" aria-busy={pending}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-sport" className="rl-label">
            Sport type
          </label>
          <select
            id="filter-sport"
            className="rl-input"
            value={sport}
            onChange={(event) => update('sport', event.target.value)}
          >
            <option value="">All sports</option>
            {SPORTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-county" className="rl-label">
            County
          </label>
          <select
            id="filter-county"
            className="rl-input"
            value={county}
            onChange={(event) => update('county', event.target.value)}
          >
            <option value="">All counties</option>
            {COUNTIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-status" className="rl-label">
            Status
          </label>
          <select
            id="filter-status"
            className="rl-input"
            value={status}
            onChange={(event) => update('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => startTransition(() => router.replace('/leagues', { scroll: false }))}
            disabled={!hasFilters}
            className="btn btn-outline-black w-full min-h-[44px] rounded-none disabled:opacity-40"
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        </div>
      </div>
    </div>
  )
}
