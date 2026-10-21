import Link from 'next/link'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  href?: string
}

/**
 * Wordmark set in the template's own logo treatment: uppercase, weight 900,
 * letter tighter than body copy, with the template's red accent dot.
 */
export function Logo({ variant = 'dark', className = '', href = '/' }: LogoProps) {
  const tone = variant === 'light' ? 'text-white' : 'text-ink'
  const content = (
    <span className={`font-black uppercase tracking-tight leading-none ${tone} ${className}`}>
      Reuben League<span className="text-primary">.</span>
    </span>
  )

  if (!href) return content

  return (
    <Link href={href} aria-label="Reuben League home" className="inline-flex items-center min-h-[44px]">
      {content}
    </Link>
  )
}
