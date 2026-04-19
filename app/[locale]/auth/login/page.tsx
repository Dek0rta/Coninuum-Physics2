import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t("login_title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("login_subtitle")}</p>
        </div>
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}
