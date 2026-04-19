import { auth } from "@/lib/auth";
import { TOPICS, CATEGORIES } from "@/lib/topics-data";
import { HomeClient } from "@/components/home/HomeClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface DashboardData {
  stats: {
    mmr: number;
    streak: number;
    accuracy: number;
    today_count: number;
    daily_goal: number;
  };
  weekly_activity: { day: string; count: number }[];
  leaderboard: { rank: number; name: string; score: number; isMe: boolean }[];
  topic_progress: {
    slug: string;
    category: string;
    titleRu: string;
    quizScore: number;
    completed: boolean;
  }[];
}

async function getDashboardData(baseUrl: string): Promise<DashboardData> {
  try {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    return {
      stats: { mmr: 0, streak: 0, accuracy: 0, today_count: 0, daily_goal: 10 },
      weekly_activity: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => ({
        day,
        count: 0,
      })),
      leaderboard: [],
      topic_progress: [],
    };
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();

  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const data = await getDashboardData(baseUrl);
  const { stats, weekly_activity, leaderboard, topic_progress } = data;

  // Build category progress from CATEGORIES
  const categoryProgress = CATEGORIES.map((cat) => {
    const catTopics = TOPICS.filter((t) => t.category === cat.id);
    const completed = topic_progress.filter(
      (p) => p.category === cat.id && p.completed
    ).length;
    const pct = catTopics.length > 0 ? Math.round((completed / catTopics.length) * 100) : 0;
    return {
      id: cat.id,
      label: locale === "ru" ? cat.labelRu : cat.labelEn,
      icon: cat.icon,
      completed,
      total: catTopics.length,
      pct,
    };
  });

  // Normalize weekly activity to array of counts (Mon→Sun)
  const last7Days = weekly_activity.map((d) => d.count);

  // Build leaderboard with initial letter
  const leaderboardMapped = leaderboard.map((entry) => ({
    rank: entry.rank,
    name: entry.name,
    initial: entry.name?.[0]?.toUpperCase() ?? "?",
    score: entry.score,
    isMe: entry.isMe,
  }));

  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? null;

  return (
    <HomeClient
      userName={userName}
      stats={stats}
      last7Days={last7Days}
      categoryProgress={categoryProgress}
      leaderboard={leaderboardMapped}
      locale={locale}
    />
  );
}
