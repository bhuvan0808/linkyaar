'use client'

import { motion, useReducedMotion } from 'motion/react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

/** Viewport-triggered fade + rise, tuned to the house motion curve. */
export function FadeIn({ children, delay = 0, y = 24, className }: FadeInProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
