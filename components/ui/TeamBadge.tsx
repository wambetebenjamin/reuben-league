import { initials } from '@/lib/format'

const FILLS = ['#f23a2e', '#000000', '#f89d13', '#8bc34a']

export function badgeFill(seed: string): string {
  let total = 0
  for (let i = 0; i < seed.length; i += 1) total += seed.charCodeAt(i)
  return FILLS[total % FILLS.length]
}

interface TeamBadgeProps {
  name: string
  seed?: string
  size?: number
  className?: string
}

/**
 * Badge placeholder. Clubs send their own crest later; until then the badge
 * uses the template palette so no club looks unfinished.
 */
export function TeamBadge({ name, seed, size = 64, className = '' }: TeamBadgeProps) {
  const fill = badgeFill(seed ?? name)

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 72" width={size} height={size} role="presentation">
        <path
          d="M32 2 60 12v26c0 16-12 26-28 32C16 64 4 54 4 38V12L32 2Z"
          fill={fill}
          stroke="#000000"
          strokeOpacity="0.12"
          strokeWidth="2"
        />
        <path d="M32 8 54 16v22c0 12-9 20-22 25C19 58 10 50 10 38V16L32 8Z" fill="none" stroke="#ffffff" strokeOpacity="0.28" />
        <text
          x="32"
          y="43"
          textAnchor="middle"
          fontFamily="Muli, Arial, sans-serif"
          fontWeight="900"
          fontSize="20"
          fill="#ffffff"
        >
          {initials(name)}
        </text>
      </svg>
    </span>
  )
}
