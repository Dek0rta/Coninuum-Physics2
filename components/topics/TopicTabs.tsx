"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TheoryContent } from "./TheoryContent";
import { SimulationPanel } from "@/components/physics/SimulationPanel";
import { QuizPanel } from "@/components/quiz/QuizPanel";
import type { QuizQuestion } from "@/lib/topic-content";

interface TopicTabsProps {
  locale: string;
  slug: string;
  theory: string;
  simulationType: string;
  quiz: QuizQuestion[];
  userId?: string;
  initialProgress: {
    quizScore?: number | null;
    completed?: boolean;
  } | null;
}

export function TopicTabs({
  locale,
  slug,
  theory,
  simulationType,
  quiz,
  userId,
  initialProgress,
}: TopicTabsProps) {
  const t = useTranslations("topics");

  return (
    <Tabs defaultValue="theory">
      <TabsList className="mb-6">
        <TabsTrigger value="theory">📖 {t("theory")}</TabsTrigger>
        <TabsTrigger value="simulation">🔬 {t("simulation")}</TabsTrigger>
        <TabsTrigger value="quiz">❓ {t("quiz")}</TabsTrigger>
      </TabsList>

      <TabsContent value="theory">
        <TheoryContent content={theory} />
      </TabsContent>

      <TabsContent value="simulation">
        <SimulationPanel type={simulationType} locale={locale} />
      </TabsContent>

      <TabsContent value="quiz">
        <QuizPanel
          questions={quiz}
          locale={locale}
          slug={slug}
          userId={userId}
          initialScore={initialProgress?.quizScore ?? null}
          initialCompleted={initialProgress?.completed ?? false}
        />
      </TabsContent>
    </Tabs>
  );
}
