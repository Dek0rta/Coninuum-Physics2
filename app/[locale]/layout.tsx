import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n-routing";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";

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
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
