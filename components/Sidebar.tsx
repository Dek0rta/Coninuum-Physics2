"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./providers/theme-provider";
import {
  Home,
  User,
  Zap,
  BookOpen,
  Layers,
  LogOut,
  Atom,
  Target,
  Trophy,
  Bot,
  Radio,
  Moon,
  Sun,
} from "lucide-react";

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;
  const navLink = (path: string) => `/${locale}${path}`;

  const overviewItems = [
    { href: navLink(""), label: "Главная", icon: Home },
    { href: navLink("/profile"), label: "Кабинет", icon: User },
  ];

  const practiceItems = [
    { href: navLink("/topics"), label: "Тренировки", icon: Zap, badge: null, badgeColor: null },
    { href: navLink("/topics"), label: "Теория", icon: BookOpen, badge: null, badgeColor: null },
    { href: navLink("/topics"), label: "Карточки", icon: Layers, badge: "NEW", badgeColor: "bg-amber-500" },
  ];

  const growthItems = [
    { href: navLink("/missions"), label: "Миссии", icon: Target, badge: "NEW", badgeColor: "bg-amber-500" },
    { href: navLink("/leaderboard"), label: "Рейтинг", icon: Trophy, badge: null, badgeColor: null },
    { href: navLink("/ai-tutor"), label: "AI Репетитор", icon: Bot, badge: "AI", badgeColor: "bg-blue-600" },
    { href: navLink("/webinars"), label: "Вебинары", icon: Radio, badge: null, badgeColor: null },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <Link href={navLink("")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Atom className="w-4 h-4 text-white dark:text-gray-900" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">PhysicsPortal</div>
            <div className="text-[10px] text-gray-400 leading-tight">Focus-first learning</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {/* ОБЗОР */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Обзор
          </div>
          <ul className="space-y-0.5">
            {overviewItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href + label} className="relative">
                  {active && (
                    <motion.span
                      layoutId="pill-overview"
                      className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Link
                    href={href}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "text-white dark:text-gray-900"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ПРАКТИКА */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Практика
          </div>
          <ul className="space-y-0.5">
            {practiceItems.map(({ href, label, icon: Icon, badge, badgeColor }) => {
              const active = isActive(href);
              return (
                <li key={label} className="relative">
                  {active && (
                    <motion.span
                      layoutId="pill-practice"
                      className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Link
                    href={href}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "text-white dark:text-gray-900"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className={`text-[9px] font-bold ${badgeColor} text-white px-1.5 py-0.5 rounded-full`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* РОСТ */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Рост
          </div>
          <ul className="space-y-0.5">
            {growthItems.map(({ href, label, icon: Icon, badge, badgeColor }) => {
              const active = isActive(href);
              return (
                <li key={label} className="relative">
                  {active && (
                    <motion.span
                      layoutId="pill-growth"
                      className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Link
                    href={href}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "text-white dark:text-gray-900"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className={`text-[9px] font-bold ${badgeColor} text-white px-1.5 py-0.5 rounded-full`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={(e) => toggleTheme(e)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
          {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
        </button>

        {session?.user ? (
          <>
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {(session.user.name ?? session.user.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.user.name ?? session.user.email?.split("@")[0]}
                </div>
                <div className="text-[10px] text-gray-400">Free</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </>
        ) : (
          <Link
            href={navLink("/auth/login")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <User className="w-4 h-4" />
            Войти
          </Link>
        )}
      </div>
    </aside>
  );
}
