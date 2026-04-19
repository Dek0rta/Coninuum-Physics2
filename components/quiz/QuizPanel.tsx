"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/topic-content";

interface QuizPanelProps {
  questions: QuizQuestion[];
  locale: string;
  slug: string;
  userId?: string;
  initialScore: number | null;
  initialCompleted: boolean;
}

export function QuizPanel({
  questions,
  locale,
  slug,
  userId,
  initialScore,
  initialCompleted,
}: QuizPanelProps) {
  const t = useTranslations("quiz");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(initialCompleted);
  const [score, setScore] = useState<number | null>(initialScore);
  const [saved, setSaved] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {locale === "ru" ? "Квиз в разработке" : "Quiz coming soon"}
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.correctIndex;
  const isLast = current === questions.length - 1;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (isCorrect) setCorrect((c) => c + 1);
  };

  const handleNext = async () => {
    if (isLast) {
      const finalScore = Math.round(((correct + (isCorrect ? 1 : 0)) / questions.length) * 100);
      setScore(finalScore);
      setFinished(true);

      if (userId) {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            quizScore: finalScore,
            completed: true,
          }),
        });
        setSaved(true);
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setChecked(false);
    setCorrect(0);
    setFinished(false);
    setScore(null);
    setSaved(false);
  };

  if (finished) {
    const pct = score ?? Math.round((correct / questions.length) * 100);
    return (
      <div className="flex flex-col items-center py-12 gap-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{pct}%</div>
          <div className="text-muted-foreground text-lg">
            {correct} / {questions.length} {locale === "ru" ? "правильно" : "correct"}
          </div>
        </div>

        <Progress value={pct} className="w-64 h-3" />

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            {t("progress_saved")}
          </div>
        )}
        {!userId && (
          <p className="text-xs text-muted-foreground">
            {locale === "ru"
              ? "Войдите, чтобы сохранить прогресс"
              : "Sign in to save progress"}
          </p>
        )}

        <Button onClick={handleRetry} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("retry")}
        </Button>
      </div>
    );
  }

  const question = locale === "ru" ? q.questionRu : q.questionEn;
  const options = q.options.map((o) => (locale === "ru" ? o.ru : o.en));
  const explanation = locale === "ru" ? q.explanationRu : q.explanationEn;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {t("question")} {current + 1} {t("of")} {questions.length}
          </span>
          <span>{correct} ✓</span>
        </div>
        <Progress value={((current) / questions.length) * 100} className="h-2" />
      </div>

      {/* Question */}
      <div className="p-6 rounded-2xl bg-muted/30 border">
        <p className="text-lg font-medium leading-relaxed">{question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, i) => {
          let variantClass = "border-border bg-card hover:bg-accent hover:border-primary/50";
          if (checked) {
            if (i === q.correctIndex) {
              variantClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
            } else if (i === selected && i !== q.correctIndex) {
              variantClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
            } else {
              variantClass = "border-border bg-card opacity-50";
            }
          } else if (selected === i) {
            variantClass = "border-primary bg-primary/10";
          }

          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                variantClass
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
                {checked && i === q.correctIndex && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                )}
                {checked && i === selected && i !== q.correctIndex && (
                  <XCircle className="ml-auto h-5 w-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {checked && (
        <div className={cn(
          "p-4 rounded-xl text-sm border",
          isCorrect
            ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300"
            : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
        )}>
          <strong>{isCorrect ? t("correct") : t("incorrect")}</strong>{" "}
          {explanation}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!checked ? (
          <Button onClick={handleCheck} disabled={selected === null}>
            {t("check")}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? t("finish") : t("next")}
          </Button>
        )}
      </div>
    </div>
  );
}
