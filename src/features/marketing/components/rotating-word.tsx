'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const WORDS = [
  { word: 'creators', color: 'oklch(0.55 0.25 293)' },
  { word: 'artists', color: 'oklch(0.6 0.21 350)' },
  { word: 'developers', color: 'oklch(0.55 0.17 250)' },
  { word: 'musicians', color: 'oklch(0.62 0.19 40)' },
  { word: 'writers', color: 'oklch(0.55 0.15 160)' },
  { word: 'everyone', color: 'oklch(0.55 0.25 293)' },
]

export function RotatingWord() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [reduce])

  const current = WORDS[index % WORDS.length]!

  return (
    <span className="relative inline-block overflow-visible align-baseline">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current.word}
          initial={reduce ? false : { y: '0.6em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: '-0.6em', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="inline-block"
          style={{ color: current.color }}
        >
          {current.word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
