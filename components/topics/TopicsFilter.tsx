"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TopicsFilterProps {
  locale: string;
  activeCategory?: string;
}

export function TopicsFilter({ locale, activeCategory }: TopicsFilterProps) {
  const t = useTranslations("topics");
  const router = useRouter();

  const categories = [
    { id: "", label: t("all") },
    { id: "mechanics", label: t("mechanics") },
    { id: "em", label: t("em") },
    { id: "thermo", label: t("thermo") },
    { id: "quantum", label: t("quantum") },
  ];

  const navigate = (cat: string) => {
    const url = cat
      ? `/${locale}/topics?category=${cat}`
      : `/${locale}/topics`;
    router.push(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(cat.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
            activeCategory === cat.id || (!activeCategory && cat.id === "")
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
