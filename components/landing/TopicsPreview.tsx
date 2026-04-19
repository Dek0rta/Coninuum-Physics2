'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { TopicData } from '@/lib/topics-data'

interface TopicsPreviewProps {
  topics: TopicData[]
  locale: string
  isRu: boolean
}

export function TopicsPreview({ topics, locale, isRu }: TopicsPreviewProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const preview = topics.slice(0, 4)

  return (
    <section ref={ref} className="px-5 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {isRu ? 'Темы' : 'Topics'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              {isRu ? 'С чего начать' : 'Where to start'}
            </h2>
          </div>
          <Link href={`/${locale}/topics`} className="secondary-link shrink-0">
            {isRu ? 'Все темы' : 'All topics'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((topic, i) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link
                href={`/${locale}/topics/${topic.slug}`}
                className={`topic-card card-base glow-${topic.category} flex h-full flex-col gap-4 rounded-2xl p-6 no-underline`}
              >
                <span className="topic-icon text-3xl">{topic.icon}</span>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                    {isRu ? topic.titleRu : topic.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {isRu ? topic.descRu : topic.descEn}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
                  {isRu ? 'Открыть' : 'Open'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
