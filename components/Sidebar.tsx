"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  User,
  Zap,
  BookOpen,
  Layers,
  LogOut,
  Sigma,
} from "lucide-react";

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  const navLink = (path: string) => `/${locale}${path}`;

  const overviewItems = [
    { href: navLink(""), label: "Главная", icon: Home },
    { href: navLink("/profile"), label: "Кабинет", icon: User },
  ];

  const practiceItems = [
    { href: navLink("/topics"), label: "Тренировки", icon: Zap, badge: null },
    { href: navLink("/topics"), label: "Теория", icon: BookOpen, badge: null },
    { href: navLink("/topics"), label: "Карточки", icon: Layers, badge: "NEW" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href={navLink("")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sigma className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 leading-tight">ContinuumPhysics</div>
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
            {overviewItems.map(({ href, label, icon: Icon }) => (
              <li key={href + label}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ПРАКТИКА */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Практика
          </div>
          <ul className="space-y-0.5">
            {practiceItems.map(({ href, label, icon: Icon, badge }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href) && label === "Тренировки"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {session?.user ? (
          <>
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {(session.user.name ?? session.user.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name ?? session.user.email?.split("@")[0]}
                </div>
                <div className="text-[10px] text-gray-400">MMR 0 · Free</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </>
        ) : (
          <Link
            href={navLink("/auth/login")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <User className="w-4 h-4" />
            Войти
          </Link>
        )}
      </div>
    </aside>
  );
}
