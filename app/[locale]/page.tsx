import { LandingPage } from "@/components/landing/LandingPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  return <LandingPage locale={locale} />;
}
