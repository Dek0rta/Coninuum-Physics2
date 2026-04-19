import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TOPICS } from "@/lib/topics-data";
import { getTopicContent } from "@/lib/topic-content";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopicTabs } from "@/components/topics/TopicTabs";
import { TheoryContent } from "@/components/topics/TheoryContent";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("topics");

  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();

  const content = getTopicContent(slug);
  const session = await auth();

  let userProgress = null;
  if (session?.user?.id) {
    const dbTopic = await prisma.topic.findUnique({ where: { slug } });
    if (dbTopic) {
      userProgress = await prisma.userProgress.findUnique({
        where: { userId_topicId: { userId: session.user.id, topicId: dbTopic.id } },
      });
    }
  }

  const title = locale === "ru" ? topic.titleRu : topic.titleEn;
  const desc = locale === "ru" ? topic.descRu : topic.descEn;
  const theory = locale === "ru" ? content.theoryRu : content.theoryEn;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href={`/${locale}/topics`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("title")}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{topic.icon}</span>
          {userProgress?.completed && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900">
              ✓ {t("completed")}
            </span>
          )}
          {userProgress?.quizScore !== undefined && userProgress?.quizScore !== null && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              {t("score")}: {userProgress.quizScore}%
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground">{desc}</p>
      </div>

      {/* Tabs */}
      <TopicTabs
        locale={locale}
        slug={slug}
        theory={theory}
        simulationType={content.simulationType}
        quiz={content.quiz}
        userId={session?.user?.id}
        initialProgress={userProgress}
      />
    </div>
  );
}
