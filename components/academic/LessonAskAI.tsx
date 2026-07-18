"use client";

import { useRef, useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Send } from "lucide-react";

type QAPair = { question: string; answer: string };

export default function LessonAskAI({
  lessonId,
  initialMessages,
}: {
  lessonId: string;
  initialMessages: { role: "user" | "model"; content: string }[];
}) {
  const [history, setHistory] = useState<QAPair[]>(() => {
    const pairs: QAPair[] = [];
    for (let i = 0; i < initialMessages.length - 1; i += 2) {
      if (initialMessages[i]?.role === "user" && initialMessages[i + 1]?.role === "model") {
        pairs.push({ question: initialMessages[i].content, answer: initialMessages[i + 1].content });
      }
    }
    return pairs;
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    setStreaming("");

    try {
      const res = await fetch(`/api/ai/lesson/${lessonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value);
        setStreaming(full);
      }

      setHistory((h) => [{ question: text, answer: full }, ...h]);
      setExpanded(0);
      setStreaming(null);
    } catch {
      setStreaming("Sorry, I couldn't respond. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-border-light bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
        <Sparkles size={16} className="text-teal" />
        <p className="text-sm font-semibold text-teal">Ask the AI coach</p>
      </div>

      <form onSubmit={ask} className="flex gap-2 px-4 py-4">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this lesson…"
          className="flex-1 border border-border-light rounded-xl px-4 py-2.5 text-sm text-teal focus:outline-none focus:border-teal"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-teal text-cream px-4 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold"
        >
          <Send size={14} />
          Ask
        </button>
      </form>

      {/* Streaming answer */}
      {streaming !== null && (
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-cream/60 border border-border-light px-4 py-3">
            <p className="text-xs text-teal/60 font-semibold mb-1">AI Coach</p>
            <p className="text-sm text-teal leading-relaxed whitespace-pre-wrap">
              {streaming || <span className="opacity-40">Thinking…</span>}
            </p>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="border-t border-border-light">
          {history.map((qa, i) => (
            <div key={i} className="border-b border-border-light last:border-b-0">
              <button
                type="button"
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-cream/40 transition"
              >
                <p className="text-sm font-medium text-teal pr-4 line-clamp-1">{qa.question}</p>
                {expanded === i ? (
                  <ChevronUp size={15} className="text-muted shrink-0" />
                ) : (
                  <ChevronDown size={15} className="text-muted shrink-0" />
                )}
              </button>
              {expanded === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-teal leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {history.length === 0 && streaming === null && (
        <p className="text-xs text-muted text-center pb-4 px-4">
          Ask about any concept, example, or anything confusing from this lesson.
        </p>
      )}
    </div>
  );
}
