'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function HeroHeading() {
  const reduced = useReducedMotion()

  return (
    <motion.h1
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] text-white tracking-tight"
    >
      Your league, fully managed
    </motion.h1>
  )
}
