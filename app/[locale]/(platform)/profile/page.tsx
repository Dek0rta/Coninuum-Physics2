import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, CheckCircle2, BarChart2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TOPICS } from "@/lib/topics-data";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const t = await getTranslations("profile");

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { topic: true },
    orderBy: { updatedAt: "desc" },
  });

  const completed = progress.filter((p) => p.completed);
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((acc, p) => acc + (p.quizScore ?? 0), 0) /
            completed.length
        )
      : 0;

  const totalTopics = TOPICS.length;
  const completedCount = completed.length;
  const pct = Math.round((completedCount / totalTopics) * 100);

  const categoryLabelMap: Record<string, { ru: string; en: string }> = {
    mechanics: { ru: "Механика", en: "Mechanics" },
    em: { ru: "Электромагнетизм", en: "Electromagnetism" },
    thermo: { ru: "Термодинамика", en: "Thermodynamics" },
    quantum: { ru: "Квантовая физика", en: "Quantum Physics" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? ""}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-primary" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {session.user.name ?? session.user.email}
          </h1>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t("completed_topics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "ru" ? "из" : "of"} {totalTopics}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              {t("average_score")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "ru" ? "средний балл" : "quiz average"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {locale === "ru" ? "Общий прогресс" : "Overall progress"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pct}%</div>
            <Progress value={pct} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("recent_activity")}</h2>
        {progress.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {t("no_progress")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {progress.map((p) => {
              const topicData = TOPICS.find((t) => t.slug === p.topic.slug);
              const title =
                locale === "ru"
                  ? (topicData?.titleRu ?? p.topic.slug)
                  : (topicData?.titleEn ?? p.topic.slug);
              const catLabel =
                categoryLabelMap[p.topic.category]?.[locale as "ru" | "en"] ??
                p.topic.category;

              return (
                <Card key={p.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {topicData?.icon ?? "📚"}
                      </span>
                      <div>
                        <div className="font-medium">{title}</div>
                        <div className="text-sm text-muted-foreground">
                          {catLabel}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.quizScore !== null && (
                        <Badge variant={p.quizScore >= 70 ? "default" : "secondary"}>
                          {p.quizScore}%
                        </Badge>
                      )}
                      {p.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
