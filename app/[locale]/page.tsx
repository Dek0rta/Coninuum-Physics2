import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Atom, Zap, Thermometer, Binary, BookOpen, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/topics-data";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tTopics = await getTranslations("topics");

  const categoryIcons = {
    mechanics: Atom,
    em: Zap,
    thermo: Thermometer,
    quantum: Binary,
  };

  const categoryColors = {
    mechanics: "from-blue-500/20 to-blue-600/5",
    em: "from-yellow-500/20 to-yellow-600/5",
    thermo: "from-red-500/20 to-red-600/5",
    quantum: "from-purple-500/20 to-purple-600/5",
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-apple-gray to-background dark:from-zinc-900 dark:to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-3.5 w-3.5" />
            Continuum Physics
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            {t("hero_title").split("").map((char, i) =>
              char === "—" ? (
                <span key={i} className="gradient-text">
                  {" "}
                  {char}{" "}
                </span>
              ) : (
                char
              )
            )}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 text-base">
              <Link href={`/${locale}/topics`}>
                {t("hero_cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base"
            >
              <Link href={`/${locale}/topics`}>{t("hero_cta_secondary")}</Link>
            </Button>
          </div>
        </div>

        {/* Decorative physics formula */}
        <div className="absolute top-12 left-8 text-6xl font-light text-foreground/5 select-none hidden lg:block">
          E = mc²
        </div>
        <div className="absolute bottom-12 right-8 text-5xl font-light text-foreground/5 select-none hidden lg:block">
          F = ma
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("features_title")}</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("features_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id as keyof typeof categoryIcons];
              const gradient = categoryColors[cat.id as keyof typeof categoryColors];
              const label = locale === "ru" ? cat.labelRu : cat.labelEn;
              const topicCount = cat.topics.length;

              return (
                <Link key={cat.id} href={`/${locale}/topics?category=${cat.id}`}>
                  <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${gradient} border-0`}>
                    <CardHeader>
                      <div className="text-3xl mb-3">{cat.icon}</div>
                      <CardTitle className="text-lg">{label}</CardTitle>
                      <CardDescription>
                        {topicCount} {locale === "ru" ? "тем" : "topics"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {cat.topics.slice(0, 3).map((topic) => (
                          <li key={topic.slug} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                            {locale === "ru" ? topic.titleRu : topic.titleEn}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-apple-gray dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === "ru" ? "Как это работает" : "How it works"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                titleRu: "1. Теория",
                titleEn: "1. Theory",
                descRu: "Читайте объяснения с формулами LaTeX",
                descEn: "Read explanations with LaTeX formulas",
              },
              {
                icon: Play,
                titleRu: "2. Симуляция",
                titleEn: "2. Simulation",
                descRu: "Управляйте параметрами и наблюдайте результат",
                descEn: "Adjust parameters and observe results",
              },
              {
                icon: Star,
                titleRu: "3. Квиз",
                titleEn: "3. Quiz",
                descRu: "Проверьте знания и сохраните прогресс",
                descEn: "Test your knowledge and save progress",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.titleEn} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {locale === "ru" ? step.titleRu : step.titleEn}
                  </h3>
                  <p className="text-muted-foreground">
                    {locale === "ru" ? step.descRu : step.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("cta_title")}</h2>
          <p className="text-xl opacity-80 mb-10">{t("cta_subtitle")}</p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-full px-10 text-base"
          >
            <Link href={`/${locale}/auth/register`}>{t("cta_button")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Continuum Physics.{" "}
            {locale === "ru" ? "Все права защищены" : "All rights reserved"}.
          </p>
        </div>
      </footer>
    </div>
  );
}
