import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Field({ id, label, error, hint, required, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="rl-label">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted mt-1">{hint}</p> : null}
      {error ? (
        <p className="rl-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
