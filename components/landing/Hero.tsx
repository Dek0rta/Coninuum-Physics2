'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  locale: string
  isRu: boolean
}

export function Hero({ locale, isRu }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-10">
      {/* Radial glow behind headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[600px] w-[900px] rounded-full opacity-[0.07] dark:opacity-[0.12]"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(211 100% 55%) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Floating physics particles (CSS only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute select-none text-2xl opacity-0"
            style={{
              left: p.x,
              top: p.y,
              animation: `fade-up ${p.dur}s cubic-bezier(0.23,1,0.32,1) ${p.delay}s infinite`,
              fontSize: p.size,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          style={{ animationDelay: '0ms' }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {isRu ? '11 интерактивных тем' : '11 interactive topics'}
        </div>

        {/* Headline */}
        <h1
          className="fade-up text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-7xl"
          style={{ animationDelay: '60ms' }}
        >
          {isRu ? (
            <>Физика, которую<br /><span className="text-gradient-primary">хочется понять</span></>
          ) : (
            <>Physics you actually<br /><span className="text-gradient-primary">want to understand</span></>
          )}
        </h1>

        {/* Subheadline */}
        <p
          className="fade-up mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
          style={{ animationDelay: '120ms' }}
        >
          {isRu
            ? 'Интерактивные симуляции, теория с формулами и умные тесты — всё в одном месте.'
            : 'Interactive simulations, theory with equations, and adaptive quizzes — all in one place.'}
        </p>

        {/* CTAs */}
        <div
          className="fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: '180ms' }}
        >
          <Link href={`/${locale}/auth/register`} className="primary-link px-8 py-3.5 text-base">
            {isRu ? 'Начать бесплатно' : 'Get started free'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${locale}/topics`} className="secondary-link px-8 py-3.5 text-base">
            {isRu ? 'Смотреть темы' : 'Browse topics'}
          </Link>
        </div>
      </div>
    </section>
  )
}

const PARTICLES = [
  { id: 1, char: 'F', x: '8%',  y: '20%', size: '1.1rem', dur: 8,  delay: 0   },
  { id: 2, char: 'v', x: '15%', y: '60%', size: '0.9rem', dur: 9,  delay: 1.5 },
  { id: 3, char: 'E', x: '78%', y: '18%', size: '1rem',   dur: 10, delay: 0.8 },
  { id: 4, char: 'λ', x: '85%', y: '55%', size: '1.2rem', dur: 7,  delay: 2.2 },
  { id: 5, char: 'Ψ', x: '5%',  y: '75%', size: '1rem',   dur: 11, delay: 3   },
  { id: 6, char: 'ħ', x: '92%', y: '80%', size: '0.95rem',dur: 8,  delay: 1   },
  { id: 7, char: '∇', x: '50%', y: '88%', size: '1.1rem', dur: 9,  delay: 4   },
  { id: 8, char: 'ε', x: '30%', y: '10%', size: '0.9rem', dur: 12, delay: 2.5 },
]
