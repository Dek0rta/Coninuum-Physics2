import { Sidebar } from "@/components/Sidebar";

interface PlatformLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PlatformLayout({ children, params }: PlatformLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar locale={locale} />
      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
