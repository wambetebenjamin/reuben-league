import type { ReactNode } from 'react'

interface SectionHeadingProps {
  subheading?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}

export function SectionHeading({
  subheading,
  title,
  description,
  align = 'left',
  as = 'h2',
}: SectionHeadingProps) {
  const Tag = as
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`section-heading max-w-3xl ${alignment}`}>
      {subheading ? (
        <span className="subheading text-base sm:text-lg font-light">{subheading}</span>
      ) : null}
      <Tag className="heading mt-1 mb-3 text-2xl sm:text-3xl lg:text-4xl font-black text-ink">{title}</Tag>
      {description ? <div className="text-sm sm:text-base text-body">{description}</div> : null}
    </div>
  )
}
