'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  BookOpen,
  Flame,
  Layers,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now()
      const tick = () => {
        const progress = Math.min((Date.now() - start) / duration, 1)
        const eased = progress < 1
          ? 1 - Math.pow(1 - progress, 4) * Math.cos(progress * Math.PI * 2.5)
          : 1
        setValue(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)

    return () => clearTimeout(timeout)
  }, [target, duration, delay])

  return value
}

function ProgressLine({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'emerald' }) {
  return (
    <div className="h-2 rounded-full bg-muted">
      <motion.div
        className={tone === 'emerald' ? 'h-2 rounded-full bg-emerald-500' : 'h-2 rounded-full bg-primary'}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      />
    </div>
  )
}

function ChartBar({ height, isToday, index }: { height: number; isToday: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={isToday ? 'w-full rounded-[0.9rem] bg-primary' : 'w-full rounded-[0.9rem] bg-foreground/[0.18]'}
      style={{ height: `${height}%`, transformOrigin: 'bottom' }}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8, delay: index * 0.04 }}
    />
  )
}

export interface HomeClientProps {
  userName: string | null
  stats: {
    mmr: number
    streak: number
    accuracy: number
    today_count: number
    daily_goal: number
  }
  last7Days: number[]
  categoryProgress: {
    id: string
    label: string
    icon: string
    completed: number
    total: number
    pct: number
  }[]
  leaderboard: {
    rank: number
    name: string
    initial: string
    score: number
    isMe: boolean
  }[]
  locale: string
}

export function HomeClient({ userName, stats, last7Days, categoryProgress, leaderboard, locale }: HomeClientProps) {
  const hour = new Date().getHours()
  const greeting = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'

  const totalMMR = useCountUp(stats.mmr, 1400, 40)
  const streak = useCountUp(stats.streak, 1000, 80)
  const accuracy = useCountUp(stats.accuracy, 1000, 120)
  const solvedToday = useCountUp(stats.today_count, 900, 160)

  const dailyGoal = stats.daily_goal
  const goalProgress = Math.min(Math.round((stats.today_count / dailyGoal) * 100), 100)
  const weekTotal = last7Days.reduce((sum, day) => sum + day, 0)
  const weekMax = Math.max(...last7Days, 1)

  const summaryCards = [
    { label: 'MMR', value: totalMMR.toLocaleString('ru-RU'), icon: Trophy },
    { label: 'Серия', value: `${streak} дн.`, icon: Flame },
    { label: 'Точность', value: `${accuracy}%`, icon: TrendingUp },
    { label: 'Сегодня', value: `${solvedToday}`, icon: Zap },
  ]

  const quickLinks = [
    { label: 'Практика', href: `/${locale}/topics`, icon: Zap },
    { label: 'Теория', href: `/${locale}/topics`, icon: BookOpen },
    { label: 'Карточки', href: `/${locale}/topics`, icon: Layers },
    { label: 'AI репетитор', href: `/${locale}/ai-tutor`, icon: Bot },
  ]

  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <div className="page-shell py-5 sm:py-8">
      {/* Hero card */}
      <section className="surface-strong overflow-hidden relative px-6 py-7 sm:px-8 sm:py-8">
        <div aria-hidden="true" className="shimmer-hero" />
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div>
            <div className="metric-pill w-fit text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {greeting}
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {userName ?? 'Добро пожаловать'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Сегодня хороший день, чтобы разобрать сложную тему, закрепить теорию и поднять точность ещё на несколько шагов.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.22 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="surface-subtle rounded-[1.4rem] px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</span>
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <motion.p
                    initial={{ scale: 0.92, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-foreground"
                  >
                    {item.value}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily goal + quick links */}
          <div className="surface rounded-[1.6rem] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Дневная цель</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {stats.today_count} из {dailyGoal}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">{goalProgress}%</span>
            </div>
            <div className="mt-5">
              <ProgressLine value={goalProgress} tone={goalProgress >= 100 ? 'emerald' : 'primary'} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="secondary-link flex flex-col items-center gap-1.5 rounded-[1rem] px-3 py-3 text-xs"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom grid */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Left: category progress */}
        <motion.div
          className="card-elevated p-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Прогресс по темам</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Что уже покрыто</h2>
            </div>
            <Link href={`/${locale}/topics`} className="secondary-link px-4 py-2.5">
              Открыть темы
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {categoryProgress.length === 0 ? (
              <div className="surface-subtle rounded-[1.4rem] px-5 py-6 text-sm text-muted-foreground">
                Пока нет данных. Начни с первой темы — здесь появится карта прогресса.
              </div>
            ) : (
              categoryProgress.map((cat) => (
                <div key={cat.id} className="surface-subtle rounded-[1.35rem] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {cat.icon} {cat.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {cat.completed} из {cat.total} тем
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{cat.pct}%</span>
                  </div>
                  <div className="mt-3">
                    <ProgressLine value={cat.pct} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right: weekly chart + leaderboard */}
        <div className="space-y-6">
          <motion.div
            className="card-elevated p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">7 дней</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Ритм недели</h2>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">{weekTotal} задач</span>
            </div>
            <div className="mt-6 grid grid-cols-7 gap-3">
              {last7Days.map((day, index) => {
                const height = Math.max((day / weekMax) * 100, day > 0 ? 18 : 10)
                const isToday = index === last7Days.length - 1

                return (
                  <div key={`day-${index}`} className="flex flex-col items-center gap-3">
                    <div className="flex h-40 w-full items-end rounded-[1.2rem] bg-muted p-2">
                      <ChartBar height={height} isToday={isToday} index={index} />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {dayLabels[index]}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{day}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            className="card-elevated p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Рейтинг</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Топ игроков</h2>
              </div>
              <Link href={`/${locale}/leaderboard`} className="secondary-link px-4 py-2.5">
                Все игроки
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {leaderboard.length === 0 ? (
                <div className="surface-subtle rounded-[1.4rem] px-5 py-6 text-sm text-muted-foreground">
                  Пока нет данных рейтинга.
                </div>
              ) : (
                leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 rounded-[1.35rem] px-4 py-4 ${entry.isMe ? 'text-background' : 'surface-subtle'}`}
                    style={entry.isMe ? {
                      background: 'linear-gradient(135deg, hsl(var(--foreground)), hsl(220 20% 28%))',
                      boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / 0.07)',
                    } : undefined}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${
                        entry.isMe ? 'bg-background/[0.12] text-background' : 'bg-background text-foreground'
                      }`}
                    >
                      {entry.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${entry.isMe ? 'text-background' : 'text-foreground'}`}>
                        {entry.name}
                      </p>
                      <p className={`mt-1 text-xs ${entry.isMe ? 'text-background/70' : 'text-muted-foreground'}`}>
                        #{entry.rank} в рейтинге
                      </p>
                    </div>
                    <p className={`text-sm font-medium ${entry.isMe ? 'text-background' : 'text-foreground'}`}>
                      {entry.score.toLocaleString('ru-RU')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
