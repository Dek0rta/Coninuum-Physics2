'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MonitorPlay, BookOpen, Brain } from 'lucide-react'

interface FeaturesProps {
  isRu: boolean
}

const FEATURES = (isRu: boolean) => [
  {
    icon: MonitorPlay,
    title: isRu ? 'Симуляции' : 'Simulations',
    desc: isRu
      ? 'Брошенное тело, электрические поля, газовые законы — управляй параметрами и смотри физику в действии.'
      : 'Projectile motion, electric fields, gas laws — control parameters and watch physics live.',
    accent: 'hsl(211 100% 55%)',
  },
  {
    icon: BookOpen,
    title: isRu ? 'Теория + MathJax' : 'Theory + MathJax',
    desc: isRu
      ? 'Чёткие объяснения с красиво отрендеренными формулами LaTeX прямо в браузере.'
      : 'Clear explanations with beautifully rendered LaTeX equations in the browser.',
    accent: 'hsl(142 72% 45%)',
  },
  {
    icon: Brain,
    title: isRu ? 'Умные тесты' : 'Smart Quizzes',
    desc: isRu
      ? 'Проверь понимание — мгновенная обратная связь и отслеживание прогресса по каждой теме.'
      : 'Test your understanding — instant feedback and per-topic progress tracking.',
    accent: 'hsl(270 80% 60%)',
  },
]

export function Features({ isRu }: FeaturesProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const features = FEATURES(isRu)

  return (
    <section ref={ref} className="px-5 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {isRu ? 'Возможности' : 'Features'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {isRu ? 'Всё для глубокого понимания' : 'Everything for deep understanding'}
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="card-elevated group relative overflow-hidden rounded-2xl p-7"
            >
              {/* Accent glow on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${f.accent}14, transparent 40%)`,
                }}
              />

              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: `${f.accent}18`, color: f.accent }}
              >
                <f.icon className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
