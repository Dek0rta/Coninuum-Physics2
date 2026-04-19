import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Trophy, Medal } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Рейтинг — PhysicsPortal" };

const SURFACES = [
  "bg-sky-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Group completed topics per user
  const completedGroups = await prisma.userProgress.groupBy({
    by: ["userId"],
    where: { completed: true },
    _count: { id: true },
  });

  // All progress records for accuracy calculation
  const allGroups = await prisma.userProgress.groupBy({
    by: ["userId"],
    _count: { id: true },
  });

  // High score groups (quizScore >= 70)
  const highScoreGroups = await prisma.userProgress.groupBy({
    by: ["userId"],
    where: { quizScore: { gte: 70 } },
    _count: { id: true },
  });

  // Get top 50 users by completed count
  const topUserIds = completedGroups
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 50)
    .map((g) => g.userId);

  // Also include current user if not in top 50
  const userIdsToFetch = currentUserId
    ? Array.from(new Set([...topUserIds, currentUserId]))
    : topUserIds;

  const users = await prisma.user.findMany({
    where: { id: { in: userIdsToFetch } },
    select: { id: true, name: true, email: true },
  });

  const completedMap = Object.fromEntries(
    completedGroups.map((r) => [r.userId, r._count.id])
  );
  const allMap = Object.fromEntries(
    allGroups.map((r) => [r.userId, r._count.id])
  );
  const highScoreMap = Object.fromEntries(
    highScoreGroups.map((r) => [r.userId, r._count.id])
  );

  const ranked = users
    .map((user) => {
      const completed = completedMap[user.id] ?? 0;
      const total = allMap[user.id] ?? 0;
      const highScore = highScoreMap[user.id] ?? 0;
      const accuracy = total > 0 ? Math.round((highScore / total) * 100) : 0;
      return {
        ...user,
        completed,
        accuracy,
        initial: (user.name ?? user.email ?? "?")[0].toUpperCase(),
        isCurrentUser: user.id === currentUserId,
      };
    })
    .sort((a, b) => b.completed - a.completed)
    .map((user, index) => ({ ...user, rank: index + 1, surface: SURFACES[index % SURFACES.length] }));

  const top50 = ranked.filter((u) => u.rank <= 50);
  const currentUser = ranked.find((u) => u.isCurrentUser);
  const top3 = top50.slice(0, 3);

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-gray-100 px-6 py-7 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Рейтинг
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Смотри, как растёт твоя позиция.
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Рейтинг по количеству пройденных тем. Сейчас {top50.length} участников.
        </p>
      </section>

      {top50.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-muted-foreground">
          <Trophy className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p className="text-lg font-semibold text-foreground">Пока нет участников</p>
          <p className="mt-2 text-sm">Изучи первую тему и стань частью рейтинга.</p>
        </div>
      ) : (
        <>
          {/* Твоя позиция */}
          {currentUser && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Твоя позиция
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">
                    #{currentUser.rank}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currentUser.completed} тем пройдено
                  </p>
                </div>
                {currentUser.rank > 1 && ranked[currentUser.rank - 2] ? (
                  <div className="min-w-[18rem]">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>До следующего места</span>
                      <span>
                        {ranked[currentUser.rank - 2].completed - currentUser.completed} тем
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        99,
                        ranked[currentUser.rank - 2].completed > 0
                          ? (currentUser.completed / ranked[currentUser.rank - 2].completed) * 100
                          : 0
                      )}
                      className="h-2"
                    />
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {/* Top-3 podium */}
          {top3.length === 3 && (
            <section className="grid gap-4 md:grid-cols-3 mb-5">
              {[top3[1], top3[0], top3[2]].map((user) => (
                <article
                  key={user.id}
                  className={cn(
                    "bg-white rounded-2xl border border-gray-100 p-6 text-center",
                    user.rank === 1 && "border-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white",
                      user.surface
                    )}
                  >
                    {user.initial}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                    {user.rank === 1 ? (
                      <Trophy className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Medal className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      #{user.rank}
                    </span>
                  </div>
                  <p className="mt-3 truncate text-lg font-semibold text-foreground">
                    {user.name ?? "Аноним"}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {user.completed}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">тем пройдено</p>
                </article>
              ))}
            </section>
          )}

          {/* Full table */}
          <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden p-0">
            <div className="border-b border-border px-6 py-4">
              <p className="text-sm font-semibold text-foreground">Таблица лидеров</p>
            </div>
            <div className="divide-y divide-border">
              {top50.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4",
                    user.isCurrentUser && "bg-muted/70"
                  )}
                >
                  <div className="w-8 text-center text-sm font-semibold text-muted-foreground">
                    {user.rank}
                  </div>
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-white",
                      user.surface
                    )}
                  >
                    {user.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name ?? "Аноним"}
                      </p>
                      {user.isCurrentUser ? (
                        <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
                          Вы
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {user.accuracy}% точность
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{user.completed}</p>
                    <p className="text-xs text-muted-foreground">тем</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
