"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Topic {
  slug: string;
  icon: string;
  category: string;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
}

interface TopicsGridProps {
  topics: Topic[];
  completedTopics: string[];
  locale: string;
  categoryColorMap: Record<string, string>;
  categoryLabelMap: Record<string, { ru: string; en: string }>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
  },
};

export function TopicsGrid({ topics, completedTopics, locale, categoryColorMap, categoryLabelMap }: TopicsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {topics.map((topic) => {
        const isCompleted = completedTopics.includes(topic.slug);
        const colorClass = categoryColorMap[topic.category];
        const catLabel = categoryLabelMap[topic.category]?.[locale as "ru" | "en"] ?? categoryLabelMap[topic.category]?.en;

        return (
          <motion.div key={topic.slug} variants={cardVariants}>
            <Link href={`/${locale}/topics/${topic.slug}`} className="block h-full">
              <div className={`topic-card surface h-full cursor-pointer relative overflow-hidden rounded-[calc(var(--radius)+0.25rem)] p-5 glow-${topic.category}`}>
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <div className="topic-icon text-3xl mb-2">{topic.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
                    {catLabel}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {locale === "ru" ? topic.titleRu : topic.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {locale === "ru" ? topic.descRu : topic.descEn}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>📖 Теория</span>
                  <span>🔬 Симуляция</span>
                  <span>❓ Тест</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
