import { Radio, Bell } from "lucide-react";

export const metadata = { title: "Вебинары — PhysicsPortal" };

export default function WebinarsPage() {
  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-gray-100 px-6 py-7 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Вебинары
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Живые занятия с преподавателями.
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Вебинары — это интерактивные сессии, где можно задать вопросы в реальном
          времени и разобрать сложные темы вместе.
        </p>
      </section>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Radio className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Вебинары скоро появятся
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Следите за обновлениями — первые вебинары по механике и электромагнетизму
          уже готовятся.
        </p>
        <button
          disabled
          className="mt-6 inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-5 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"
        >
          <Bell className="h-4 w-4" />
          Уведомить меня
        </button>
      </div>
    </div>
  );
}
