"use client";

import { useEffect, useRef } from "react";

interface TheoryContentProps {
  content: string;
}

// Simple markdown-to-HTML renderer (headers, bold, paragraphs, math)
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-5">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="my-3 space-y-1">${m}</ul>`)
    .replace(/\$\$[\s\S]+?\$\$/g, (m) => `<div class="math-display my-4 text-center overflow-x-auto">${m}</div>`)
    .replace(/\$(.+?)\$/g, '<span class="math-inline">$$$1$$</span>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[hul])(.+)$/gm, (m) => m.trim() ? m : "");
}

export function TheoryContent({ content }: TheoryContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Typeset MathJax after render
    if (typeof window !== "undefined" && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise([ref.current]);
    }
  }, [content]);

  const html = renderMarkdown(content);

  return (
    <div
      ref={ref}
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: `<div class="space-y-2">${html}</div>`,
      }}
    />
  );
}
