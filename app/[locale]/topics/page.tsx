import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPICS, CATEGORIES } from "@/lib/topics-data";
import { TopicsFilter } from "@/components/topics/TopicsFilter";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function TopicsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations("topics");
  const session = await auth();

  // Load user progress if logged in
  let completedTopics: string[] = [];
  if (session?.user?.id) {
    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { topic: { select: { slug: true } } },
    });
    completedTopics = progress.map((p) => p.topic.slug);
  }

  const filteredTopics = category
    ? TOPICS.filter((t) => t.category === category)
    : TOPICS;

  const categoryColorMap = {
    mechanics: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    em: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
    thermo: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
    quantum: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  };

  const categoryLabelMap = {
    mechanics: { ru: "Механика", en: "Mechanics" },
    em: { ru: "Электромагнетизм", en: "Electromagnetism" },
    thermo: { ru: "Термодинамика", en: "Thermodynamics" },
    quantum: { ru: "Квантовая физика", en: "Quantum Physics" },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Filter */}
      <TopicsFilter locale={locale} activeCategory={category} />

      {/* Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredTopics.map((topic) => {
          const isCompleted = completedTopics.includes(topic.slug);
          const colorClass = categoryColorMap[topic.category];
          const catLabel = categoryLabelMap[topic.category][locale as "ru" | "en"] ?? categoryLabelMap[topic.category].en;

          return (
            <Link key={topic.slug} href={`/${locale}/topics/${topic.slug}`}>
              <Card className="group h-full cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="text-3xl mb-2">{topic.icon}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
                      {catLabel}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {locale === "ru" ? topic.titleRu : topic.titleEn}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ru" ? topic.descRu : topic.descEn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      📖 {t("theory")}
                    </span>
                    <span className="flex items-center gap-1">
                      🔬 {t("simulation")}
                    </span>
                    <span className="flex items-center gap-1">
                      ❓ {t("quiz")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
