"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "model"; content: string };

export default function CoachChat({
  initialMessages,
  endpoint = "/api/ai/coach",
  placeholder = "Ask your coach...",
  emptyHint = "Ask your AI coach anything — study plans, subject help, or exam strategy.",
  heightClassName = "h-[calc(100vh-9rem)]",
}: {
  initialMessages: Message[];
  endpoint?: string;
  placeholder?: string;
  emptyHint?: string;
  heightClassName?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: text }, { role: "model", content: "" }]);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "model",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "model",
          content: "Sorry, I couldn't respond. Please try again.",
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`flex flex-col ${heightClassName}`}>
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted text-center mt-8">{emptyHint}</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
              m.role === "user"
                ? "self-end bg-teal text-cream"
                : "self-start bg-white border border-border-light text-teal"
            }`}
          >
            {m.content || (m.role === "model" && sending ? "..." : "")}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 px-6 py-4 border-t border-border-light">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-border-light rounded-lg px-4 py-2 text-sm text-teal"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-teal text-cream font-semibold px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
