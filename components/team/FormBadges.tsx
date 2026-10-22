'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface FormBadgesProps {
  form: Array<'W' | 'D' | 'L'>
}

export function FormBadges({ form }: FormBadgesProps) {
  const reduced = useReducedMotion()

  if (form.length === 0) {
    return <span className="text-xs text-muted">No matches played</span>
  }

  return (
    <div className="flex items-center gap-1.5 sm:justify-end">
      {form.map((result, index) => (
        <motion.span
          key={`${result}-${index}`}
          initial={reduced ? false : { opacity: 0, scale: 0.4 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, delay: index * 0.08, type: 'spring', stiffness: 320, damping: 20 }}
          className={`inline-flex items-center justify-center w-7 h-7 text-xs font-black text-white ${
            result === 'W' ? 'bg-brand-green' : result === 'L' ? 'bg-primary' : 'bg-chip'
          }`}
          aria-label={result === 'W' ? 'Won' : result === 'L' ? 'Lost' : 'Drew'}
        >
          {result}
        </motion.span>
      ))}
    </div>
  )
}
