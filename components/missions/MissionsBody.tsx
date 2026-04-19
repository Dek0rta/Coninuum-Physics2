'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Lock, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Mission {
  id: string
  emoji: string
  title: string
  description: string
  type: string
  target: number
  rewardXp: number
  locked: boolean
  progress: number
}

interface MissionsBodyProps {
  missions: Mission[]
  completedCount: number
  totalXp: number
  isEmpty: boolean
  locale: string
}

const revealVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  }),
}

export function MissionsBody({ missions, completedCount, totalXp, isEmpty, locale }: MissionsBodyProps) {
  return (
    <>
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { value: completedCount, label: 'выполнено' },
          { value: totalXp, label: 'XP заработано' },
          { value: missions.length - completedCount, label: 'осталось' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="bg-white rounded-2xl border border-gray-100 p-5 text-center"
          >
            <p className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-6 space-y-4">
        {missions.map((mission, i) => {
          const done = mission.progress >= mission.target
          const pct = Math.round((mission.progress / mission.target) * 100)

          return (
            <motion.article
              key={mission.id}
              custom={i}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.97 },
                show: (idx: number) => ({
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: idx * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                }),
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className={cn('bg-white rounded-2xl border border-gray-100 p-6', mission.locked && 'opacity-70')}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl">{mission.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{mission.title}</h2>
                    <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{mission.type}</span>
                    {mission.locked ? <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Locked</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{mission.description}</p>

                  {!mission.locked ? (
                    <div className="mt-4 max-w-xl">
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{mission.progress} / {mission.target}</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  ) : null}
                </div>
                <div className="shrink-0">
                  {done ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Выполнено
                    </div>
                  ) : mission.locked ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      Заперто
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-600">
                      <Star className="h-4 w-4" />
                      +{mission.rewardXp} XP
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          )
        })}
      </section>

      {isEmpty ? (
        <section className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 h-5 w-5 text-primary" />
            <p className="text-sm leading-7 text-muted-foreground">
              Изучи первую тему в <Link href={`/${locale}/topics`} className="text-primary hover:underline">каталоге тем</Link>, и миссии начнут заполняться автоматически.
            </p>
          </div>
        </section>
      ) : null}
    </>
  )
}
