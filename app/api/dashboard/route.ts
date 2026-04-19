import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  // Weekly activity: last 7 days labels
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const weekly_activity = days.map((day) => ({ day, count: 0 }));

  if (!session?.user?.id) {
    return NextResponse.json({
      stats: { mmr: 0, streak: 0, accuracy: 0, today_count: 0, daily_goal: 10 },
      weekly_activity,
      leaderboard: [],
      topic_progress: [],
    });
  }

  const { prisma } = await import("@/lib/prisma");

  // Topic progress grouped by category
  const userProgress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { topic: true },
  });

  const topic_progress = userProgress.map((p) => ({
    slug: p.topic.slug,
    category: p.topic.category,
    titleRu: p.topic.titleRu,
    quizScore: p.quizScore,
    completed: p.completed,
  }));

  // Today count
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today_count = userProgress.filter(
    (p) => p.completedAt && p.completedAt >= todayStart
  ).length;

  // Weekly activity: completed per weekday (Mon=0 … Sun=6)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const recentCompleted = userProgress.filter(
    (p) => p.completedAt && p.completedAt >= weekAgo
  );

  recentCompleted.forEach((p) => {
    if (!p.completedAt) return;
    // JS getDay(): 0=Sun,1=Mon…6=Sat → map to Mon=0..Sun=6
    const jsDay = p.completedAt.getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    weekly_activity[idx].count += 1;
  });

  // Accuracy: avg quiz score of completed topics
  const completed = userProgress.filter((p) => p.completed);
  const accuracy =
    completed.length > 0
      ? Math.round(completed.reduce((s, p) => s + (p.quizScore ?? 0), 0) / completed.length)
      : 0;

  // Top leaderboard (global, top 5 by completed count)
  const topUsers = await prisma.userProgress.groupBy({
    by: ["userId"],
    where: { completed: true },
    _count: { completed: true },
    orderBy: { _count: { completed: "desc" } },
    take: 5,
  });

  const userIds = topUsers.map((u) => u.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  const leaderboard = topUsers.map((u, i) => {
    const user = users.find((usr) => usr.id === u.userId);
    return {
      rank: i + 1,
      name: user?.name ?? user?.email?.split("@")[0] ?? "Игрок",
      score: u._count.completed * 10,
      isMe: u.userId === session.user!.id,
    };
  });

  return NextResponse.json({
    stats: {
      mmr: completed.length * 10,
      streak: 0,
      accuracy,
      today_count,
      daily_goal: 10,
    },
    weekly_activity,
    leaderboard,
    topic_progress,
  });
}
