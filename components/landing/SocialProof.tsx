'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SocialProofProps {
  isRu: boolean
}

const STATS = (isRu: boolean) => [
  { value: '11', label: isRu ? 'тем физики' : 'physics topics' },
  { value: '4',  label: isRu ? 'интерактивных симуляции' : 'interactive simulations' },
  { value: '200+', label: isRu ? 'вопросов в тестах' : 'quiz questions' },
  { value: '4',  label: isRu ? 'раздела курса' : 'course sections' },
]

export function SocialProof({ isRu }: SocialProofProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const stats = STATS(isRu)

  return (
    <section ref={ref} className="px-5 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="surface-strong grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="surface-subtle flex flex-col items-center justify-center px-6 py-10 text-center"
            >
              <span className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
