import { Bot, Send } from "lucide-react";

export const metadata = { title: "AI Репетитор — PhysicsPortal" };

const SUGGESTED = [
  "Объясни второй закон Ньютона",
  "Что такое интерференция?",
  "Как работает фотоэффект?",
  "В чём суть принципа неопределённости Гейзенберга?",
  "Объясни закон Кулона простыми словами",
];

export default function AiTutorPage() {
  return (
    <div className="px-6 py-6 max-w-4xl mx-auto flex flex-col" style={{ height: "calc(100vh - 48px)" }}>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Репетитор</h1>
            <p className="text-sm text-muted-foreground">
              Персональный помощник по физике
            </p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded-full">
            AI
          </span>
        </div>
      </div>

      {/* Chat shell */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden min-h-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
              <p className="text-sm text-foreground leading-relaxed">
                Скоро здесь появится AI репетитор по физике. Он сможет объяснять
                теорию, решать задачи вместе с тобой и отвечать на любые вопросы
                по курсу.
              </p>
            </div>
          </div>

          {/* Suggested questions */}
          <div className="pl-11">
            <p className="text-xs text-muted-foreground mb-3">Попробуй спросить:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  disabled
                  className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              disabled
              placeholder="Скоро здесь можно будет задать вопрос..."
              className="flex-1 resize-none bg-gray-50 rounded-xl px-4 py-3 text-sm text-muted-foreground placeholder:text-gray-400 border border-gray-100 outline-none cursor-not-allowed min-h-[44px] max-h-32"
              rows={1}
            />
            <button
              disabled
              className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center cursor-not-allowed"
              aria-label="Скоро"
            >
              <Send className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Функция в разработке — следите за обновлениями
          </p>
        </div>
      </div>
    </div>
  );
}
