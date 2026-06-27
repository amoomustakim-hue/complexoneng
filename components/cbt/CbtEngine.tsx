"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCachedQuestions, setCachedQuestions, type CachedQuestion } from "@/lib/cbt-cache";

const SECONDS_PER_QUESTION = 60;

type Props = {
  examType: string;
  subject: string;
};

export default function CbtEngine({ examType, subject }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<CachedQuestion[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    let active = true;

    async function load() {
      const cached = await getCachedQuestions(examType, subject);
      if (cached && cached.length > 0 && active) {
        setQuestions(cached);
        setSecondsLeft(cached.length * SECONDS_PER_QUESTION);
      }

      try {
        const res = await fetch(
          `/api/cbt/questions?examType=${examType}&subject=${encodeURIComponent(subject)}`
        );
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        const fetched: CachedQuestion[] = data.questions;

        if (!active) return;

        if (fetched.length === 0 && !cached) {
          setLoadError("No questions available for this subject yet.");
          return;
        }

        if (fetched.length > 0) {
          setQuestions(fetched);
          setSecondsLeft((prev) => prev || fetched.length * SECONDS_PER_QUESTION);
          await setCachedQuestions(examType, subject, fetched);
        }
      } catch {
        if (!cached && active) {
          setLoadError("Could not load questions. Check your connection.");
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [examType, subject]);

  const total = questions?.length ?? 0;

  const localScore = useMemo(() => {
    if (!questions) return 0;
    return questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
  }, [questions, answers]);

  useEffect(() => {
    if (!questions || submitted || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, submitted]);

  async function handleSubmit() {
    if (!questions || submitted) return;
    setSubmitted(true);
    setScore(localScore);

    try {
      await fetch("/api/cbt/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType,
          subject,
          score: localScore,
          total: questions.length,
          answers,
          startedAt,
        }),
      });
    } catch {
      // offline — session will simply not sync; local result still shown
    }
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-red-600">{loadError}</p>
        <button onClick={() => router.push("/academic/cbt")} className="mt-4 text-teal underline">
          Back to subjects
        </button>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-border-light rounded w-1/3" />
          <div className="h-24 bg-border-light rounded" />
          <div className="h-10 bg-border-light rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs tracking-widest text-teal">RESULT</p>
        <h1 className="text-3xl font-bold text-teal mt-1">
          {score} / {total}
        </h1>
        <p className="text-sm text-muted mt-1">
          {subject} — {examType.replace("_", "-")}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const correct = userAnswer === q.answer;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${
                  correct ? "border-border-light" : "border-red-300 bg-red-50"
                }`}
              >
                <p className="text-sm font-medium text-teal">
                  {i + 1}. {q.question}
                </p>
                <p className="text-sm mt-1">
                  Your answer: <span className="font-semibold">{userAnswer ?? "—"}</span>
                  {!correct && (
                    <>
                      {" "}
                      · Correct: <span className="font-semibold text-teal">{q.answer}</span>
                    </>
                  )}
                </p>
                {q.explanation && (
                  <p className="text-xs text-muted mt-1">{q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/academic/cbt")}
          className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-8"
        >
          Practice another subject
        </button>
      </div>
    );
  }

  const question = questions[current];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-widest text-teal">
          QUESTION {current + 1} OF {total}
        </p>
        <p className="text-sm font-semibold text-teal">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-4">
        <p className="text-base text-teal font-medium">{question.question}</p>

        <div className="flex flex-col gap-2 mt-4">
          {question.options.map((opt) => {
            const selected = answers[question.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt }))}
                className={`text-left text-sm px-4 py-3 rounded-lg border ${
                  selected
                    ? "border-teal bg-cream text-teal font-semibold"
                    : "border-border-light text-teal"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="text-sm font-semibold text-teal px-4 py-2 rounded-lg border border-border-light disabled:opacity-40"
        >
          Previous
        </button>

        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
