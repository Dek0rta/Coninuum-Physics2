"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("theory");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6 p-1 h-auto gap-1 bg-transparent border border-border/60 backdrop-blur-sm rounded-[calc(var(--radius)+0.25rem)]">
        <TabsTrigger
          value="theory"
          className="rounded-[calc(var(--radius)-0.125rem)] px-4 py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_hsl(211_100%_65%/0.06)] data-[state=inactive]:text-muted-foreground transition-all duration-200"
        >
          📖 {t("theory")}
        </TabsTrigger>
        <TabsTrigger
          value="simulation"
          className="rounded-[calc(var(--radius)-0.125rem)] px-4 py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_hsl(211_100%_65%/0.06)] data-[state=inactive]:text-muted-foreground transition-all duration-200"
        >
          🔬 {t("simulation")}
        </TabsTrigger>
        <TabsTrigger
          value="quiz"
          className="rounded-[calc(var(--radius)-0.125rem)] px-4 py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_hsl(211_100%_65%/0.06)] data-[state=inactive]:text-muted-foreground transition-all duration-200"
        >
          ❓ {t("quiz")}
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          {activeTab === "theory" && <TheoryContent content={theory} />}
          {activeTab === "simulation" && <SimulationPanel type={simulationType} locale={locale} />}
          {activeTab === "quiz" && (
            <QuizPanel
              questions={quiz}
              locale={locale}
              slug={slug}
              userId={userId}
              initialScore={initialProgress?.quizScore ?? null}
              initialCompleted={initialProgress?.completed ?? false}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
}
