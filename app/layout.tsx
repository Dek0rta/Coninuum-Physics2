import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Continuum Physics — Interactive Learning",
  description: "Интерактивный образовательный сайт по физике с симуляциями, квизами и прогрессом",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}` }} />
        <script
          id="mathjax-config"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                },
                svg: { fontCache: 'global' },
                startup: { typeset: false }
              };
            `,
          }}
        />
        <script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
          async
        />
      </head>
      <body className={onest.className}>{children}</body>
    </html>
  );
}
