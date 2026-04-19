'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HowItWorksProps {
  isRu: boolean
}

const STEPS = (isRu: boolean) => [
  {
    num: '01',
    title: isRu ? 'Выбери тему' : 'Pick a topic',
    desc: isRu
      ? 'Механика, электромагнетизм, термодинамика или квантовая физика — 11 тем на выбор.'
      : 'Mechanics, electromagnetism, thermodynamics, or quantum physics — 11 topics to choose from.',
  },
  {
    num: '02',
    title: isRu ? 'Разбери теорию' : 'Study the theory',
    desc: isRu
      ? 'Читай объяснения с формулами LaTeX, взаимодействуй с симуляцией, задавай вопросы.'
      : 'Read explanations with LaTeX equations, interact with the simulation, ask questions.',
  },
  {
    num: '03',
    title: isRu ? 'Проверь себя' : 'Test yourself',
    desc: isRu
      ? 'Пройди тест по теме и отслеживай точность — система запомнит твой прогресс.'
      : 'Take the topic quiz and track accuracy — the system saves your progress.',
  },
]

export function HowItWorks({ isRu }: HowItWorksProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const steps = STEPS(isRu)

  return (
    <section ref={ref} className="px-5 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {isRu ? 'Как это работает' : 'How it works'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {isRu ? 'Три шага к знаниям' : 'Three steps to mastery'}
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="surface rounded-2xl p-7"
            >
              <span className="text-5xl font-semibold tracking-[-0.04em] text-primary/20">
                {step.num}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.025em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
