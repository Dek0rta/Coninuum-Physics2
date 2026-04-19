'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CtaSectionProps {
  locale: string
  isRu: boolean
}

export function CtaSection({ locale, isRu }: CtaSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="px-5 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="surface-strong relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14"
        >
          <div aria-hidden="true" className="shimmer-hero" />

          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, hsl(211 100% 55% / 0.08) 0%, transparent 60%)',
            }}
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {isRu ? 'Бесплатно' : 'Free'}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {isRu ? (
                <>Начни изучать физику<br /><span className="text-gradient-primary">прямо сейчас</span></>
              ) : (
                <>Start learning physics<br /><span className="text-gradient-primary">right now</span></>
              )}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              {isRu
                ? 'Регистрация за 30 секунд. Никакой кредитной карты. Все темы и симуляции открыты сразу.'
                : 'Sign up in 30 seconds. No credit card. All topics and simulations open immediately.'}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/auth/register`} className="primary-link px-9 py-3.5 text-base">
                {isRu ? 'Создать аккаунт' : 'Create account'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}/auth/login`} className="secondary-link px-9 py-3.5 text-base">
                {isRu ? 'Войти' : 'Sign in'}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
