import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Target } from "lucide-react";
import { MissionsBody } from "@/components/missions/MissionsBody";

export const dynamic = "force-dynamic";
export const metadata = { title: "Миссии — PhysicsPortal" };

const MISSIONS = [
  {
    id: "first-topic",
    emoji: "🎯",
    title: "Первые шаги",
    description: "Изучи свою первую тему",
    type: "Старт",
    target: 1,
    rewardXp: 20,
    locked: false,
    compute: (p: { total: number }) => Math.min(p.total, 1),
  },
  {
    id: "daily-3",
    emoji: "📚",
    title: "Дневная норма",
    description: "Изучи 3 темы сегодня",
    type: "Ежедневная",
    target: 3,
    rewardXp: 50,
    locked: false,
    compute: (p: { today: number }) => Math.min(p.today, 3),
  },
  {
    id: "score-5",
    emoji: "⭐",
    title: "Отличник",
    description: "Набери 70% и выше в квизе по 5 темам",
    type: "Еженедельная",
    target: 5,
    rewardXp: 100,
    locked: false,
    compute: (p: { highScore: number }) => Math.min(p.highScore, 5),
  },
  {
    id: "categories-3",
    emoji: "🗺️",
    title: "Исследователь",
    description: "Изучи темы из 3 разных категорий",
    type: "Еженедельная",
    target: 3,
    rewardXp: 150,
    locked: false,
    compute: (p: { categories: number }) => Math.min(p.categories, 3),
  },
  {
    id: "complete-10",
    emoji: "🏆",
    title: "Мастер",
    description: "Пройди 10 тем полностью",
    type: "Достижение",
    target: 10,
    rewardXp: 500,
    locked: false,
    compute: (p: { total: number }) => Math.min(p.total, 10),
  },
  {
    id: "streak-7",
    emoji: "🔥",
    title: "Несгораемый",
    description: "Занимайся 7 дней подряд",
    type: "Достижение",
    target: 7,
    rewardXp: 300,
    locked: true,
    compute: (_p: object) => 0,
  },
];

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);
  const userId = session.user.id;

  const progressRecords = await prisma.userProgress.findMany({
    where: { userId, completed: true },
    include: { topic: { select: { category: true } } },
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const stats = {
    total: progressRecords.length,
    today: progressRecords.filter(
      (p) => p.completedAt && new Date(p.completedAt) >= todayStart
    ).length,
    highScore: progressRecords.filter((p) => (p.quizScore ?? 0) >= 70).length,
    categories: new Set(progressRecords.map((p) => p.topic.category)).size,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const missions = MISSIONS.map(({ compute, ...mission }) => ({
    ...mission,
    progress: compute(stats as any),
  }));

  const completed = missions.filter((m) => m.progress >= m.target);
  const totalXp = completed.reduce((sum, m) => sum + m.rewardXp, 0);

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Миссии
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Маленькие цели, которые создают устойчивый прогресс.
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Миссии помогают видеть прогресс и не терять темп даже в короткие дни.
        </p>
      </section>

      <MissionsBody
        missions={missions}
        completedCount={completed.length}
        totalXp={totalXp}
        isEmpty={stats.total === 0}
        locale={locale}
      />
    </div>
  );
}
