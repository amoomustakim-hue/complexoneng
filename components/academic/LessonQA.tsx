"use client";

import { useState } from "react";

type Answer = {
  id: string;
  content: string;
  isBest: boolean;
  profile: { fullName: string | null; email: string };
};

type Question = {
  id: string;
  content: string;
  profile: { fullName: string | null; email: string };
  profileId: string;
  answers: Answer[];
};

export default function LessonQA({
  lessonId,
  initialQuestions,
  currentProfileId,
}: {
  lessonId: string;
  initialQuestions: Question[];
  currentProfileId: string;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function askQuestion(e: React.FormEvent) {
    e.preventDefault();
    const content = newQuestion.trim();
    if (!content) return;

    const res = await fetch(`/api/lessons/${lessonId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const data = await res.json();
      setQuestions((prev) => [data.question, ...prev]);
      setNewQuestion("");
    }
  }

  async function submitAnswer(questionId: string) {
    const content = drafts[questionId]?.trim();
    if (!content) return;

    const res = await fetch(`/api/lessons/questions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const data = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, answers: [...q.answers, data.answer] } : q))
      );
      setDrafts((d) => ({ ...d, [questionId]: "" }));
    }
  }

  async function markBest(questionId: string, answerId: string) {
    const res = await fetch(`/api/lessons/answers/${answerId}/best`, { method: "POST" });
    if (res.ok) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answers: q.answers.map((a) => ({ ...a, isBest: a.id === answerId })) }
            : q
        )
      );
    }
  }

  return (
    <div>
      <form onSubmit={askQuestion} className="flex gap-2">
        <input
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this lesson..."
          className="flex-1 text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
        />
        <button type="submit" className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg">
          Ask
        </button>
      </form>

      <div className="flex flex-col gap-4 mt-4">
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg bg-cream p-3">
            <p className="text-sm font-medium text-teal">{q.content}</p>
            <p className="text-xs text-muted mt-0.5">
              — {q.profile.fullName ?? q.profile.email}
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {q.answers.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-lg p-2 ${a.isBest ? "bg-white border border-teal" : "bg-white"}`}
                >
                  <p className="text-sm text-muted">
                    {a.isBest && <span className="text-teal font-semibold">Best answer · </span>}
                    {a.content}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted">— {a.profile.fullName ?? a.profile.email}</p>
                    {q.profileId === currentProfileId && !a.isBest && (
                      <button
                        onClick={() => markBest(q.id, a.id)}
                        className="text-xs text-teal underline"
                      >
                        Mark as best
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                value={drafts[q.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                placeholder="Write an answer..."
                className="flex-1 text-xs border border-border-light rounded-lg px-2 py-1.5 text-teal"
              />
              <button
                onClick={() => submitAnswer(q.id)}
                className="text-xs font-semibold text-teal border border-border-light px-3 py-1.5 rounded-lg"
              >
                Answer
              </button>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-sm text-muted text-center py-6">No questions yet on this lesson.</p>
        )}
      </div>
    </div>
  );
}
