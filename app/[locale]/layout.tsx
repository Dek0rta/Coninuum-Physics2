import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n-routing";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers session={session}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
          <Sidebar locale={locale} />
          <main className="flex-1 ml-[260px] min-h-screen">
            {children}
          </main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
