import { Hero } from './Hero'
import { SocialProof } from './SocialProof'
import { Features } from './Features'
import { HowItWorks } from './HowItWorks'
import { TopicsPreview } from './TopicsPreview'
import { CtaSection } from './CtaSection'
import { TOPICS } from '@/lib/topics-data'

interface LandingPageProps {
  locale: string
}

export function LandingPage({ locale }: LandingPageProps) {
  const isRu = locale === 'ru'

  return (
    <div className="min-h-screen">
      <Hero locale={locale} isRu={isRu} />
      <SocialProof isRu={isRu} />
      <Features isRu={isRu} />
      <HowItWorks isRu={isRu} />
      <TopicsPreview topics={TOPICS} locale={locale} isRu={isRu} />
      <CtaSection locale={locale} isRu={isRu} />
    </div>
  )
}
