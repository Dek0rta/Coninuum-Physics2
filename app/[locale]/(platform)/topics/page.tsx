import { getTranslations } from "next-intl/server";
import { TOPICS } from "@/lib/topics-data";
import { TopicsFilter } from "@/components/topics/TopicsFilter";
import { TopicsGrid } from "@/components/topics/TopicsGrid";
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
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <TopicsFilter locale={locale} activeCategory={category} />

      <TopicsGrid
        topics={filteredTopics}
        completedTopics={completedTopics}
        locale={locale}
        categoryColorMap={categoryColorMap}
        categoryLabelMap={categoryLabelMap}
      />
    </div>
  );
}
