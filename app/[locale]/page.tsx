import Link from "next/link";
import { auth } from "@/lib/auth";
import { TOPICS, CATEGORIES } from "@/lib/topics-data";
import {
  Zap,
  BookOpen,
  Layers,
  Bot,
  Target,
  Flame,
  TrendingUp,
  CheckCircle2,
  Crown,
  Trophy,
} from "lucide-react";

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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();

  // Build base URL for internal API call
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const data = await getDashboardData(baseUrl);

  const { stats, weekly_activity, leaderboard, topic_progress } = data;

  // Build category progress
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

  const dailyPct = Math.min(
    100,
    Math.round((stats.today_count / stats.daily_goal) * 100)
  );

  const maxActivity = Math.max(...weekly_activity.map((d) => d.count), 1);

  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? null;

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      {/* TOP HERO CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Left: greeting + stats */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium mb-3">
              ✨ {getGreeting()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {userName ? (
                <>
                  Привет, {userName}
                  {stats.mmr >= 100 && (
                    <Crown className="inline w-5 h-5 text-amber-400 ml-1.5 -mt-0.5" />
                  )}
                </>
              ) : (
                "Добро пожаловать"
              )}
            </h1>
            <p className="text-gray-400 text-sm mb-5">
              Продолжай учиться — каждый день на шаг ближе к мастерству
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Trophy,
                  value: stats.mmr,
                  label: "MMR",
                  color: "text-amber-500",
                },
                {
                  icon: Flame,
                  value: stats.streak,
                  label: "Серия",
                  color: "text-orange-500",
                },
                {
                  icon: TrendingUp,
                  value: `${stats.accuracy}%`,
                  label: "Точность",
                  color: "text-blue-500",
                },
                {
                  icon: CheckCircle2,
                  value: stats.today_count,
                  label: "Сегодня",
                  color: "text-green-500",
                },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 leading-tight">
                      {value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: daily goal + quick actions */}
          <div className="lg:w-[220px] flex flex-col gap-4">
            {/* Daily goal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Дневная цель</span>
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {stats.today_count} из {stats.daily_goal} заданий
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">{dailyPct}%</div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Zap, label: "Трен-ки", href: `/${locale}/topics` },
                { icon: BookOpen, label: "Теория", href: `/${locale}/topics` },
                { icon: Layers, label: "Карточки", href: `/${locale}/topics` },
                { icon: Bot, label: "AI репетитор", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-xl text-center text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Topic progress — 2 cols wide */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Прогресс по темам</h2>
            <Link
              href={`/${locale}/topics`}
              className="text-xs text-blue-600 hover:underline"
            >
              Открыть темы →
            </Link>
          </div>
          <div className="space-y-4">
            {categoryProgress.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {cat.completed}/{cat.total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Weekly rhythm */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Ритм недели</h2>
            <div className="flex items-end gap-1.5 h-16">
              {weekly_activity.map(({ day, count }) => {
                const heightPct = Math.round((count / maxActivity) * 100);
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-blue-600 rounded-sm transition-all"
                      style={{
                        height: `${Math.max(heightPct, count > 0 ? 10 : 4)}%`,
                        opacity: count > 0 ? 1 : 0.15,
                      }}
                    />
                    <span className="text-[9px] text-gray-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
            <h2 className="font-semibold text-gray-900 mb-4">Топ игроков</h2>
            {leaderboard.length === 0 ? (
              <p className="text-xs text-gray-400">Пока нет данных</p>
            ) : (
              <ul className="space-y-2">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.rank}
                    className={`flex items-center gap-2 text-sm ${
                      entry.isMe ? "font-semibold text-blue-600" : "text-gray-700"
                    }`}
                  >
                    <span className="w-5 text-center text-xs text-gray-400 font-medium">
                      {entry.rank}
                    </span>
                    <span className="flex-1 truncate">{entry.name}</span>
                    <span className="text-xs text-gray-400">{entry.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Continuum Physics
      </footer>
    </div>
  );
}
