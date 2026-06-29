"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/lib/moduleQuiz";

export default function ModuleQuiz({
  moduleId,
  moduleTitle,
  continueHref,
  continueLabel,
}: {
  moduleId: string;
  moduleTitle: string;
  continueHref: string;
  continueLabel: string;
}) {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [retaking, setRetaking] = useState(false);

  function loadQuiz(retake: boolean) {
    setError("");
    setQuiz(null);
    setSubmitted(false);
    setAnswers({});

    fetch(`/api/modules/${moduleId}/quiz${retake ? "?retake=true" : ""}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Couldn't load a quiz for this topic.");
          return;
        }
        setQuiz(data.quiz);
        setIsAdaptive(Boolean(data.isAdaptive));
      })
      .catch(() => {
        setError("Couldn't load a quiz for this topic.");
      })
      .finally(() => setRetaking(false));
  }

  useEffect(() => {
    loadQuiz(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  async function handleSubmit() {
    if (!quiz) return;
    const finalScore = quiz.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);
    setScore(finalScore);
    setSubmitted(true);

    try {
      await fetch(`/api/modules/${moduleId}/quiz/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: finalScore, total: quiz.length, answers, questionsUsed: quiz }),
      });
    } catch {
      // attempt logging is best-effort
    }
  }

  function handleRetake() {
    setRetaking(true);
    loadQuiz(true);
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <p className="text-xs text-muted mt-1">No worries — you can come back to this check later.</p>
        <Link
          href={continueHref}
          className="inline-block mt-6 bg-teal text-cream font-semibold px-6 py-3 rounded-lg"
        >
          {continueLabel}
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-border-light rounded w-1/2" />
          <div className="h-20 bg-border-light rounded" />
          <div className="h-20 bg-border-light rounded" />
        </div>
      </div>
    );
  }

  if (submitted) {
    const passed = score >= quiz.length;
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-xs tracking-widest text-teal">
          {isAdaptive ? "FOCUSED REVIEW RESULT" : "QUICK CHECK RESULT"}
        </p>
        <h1 className="text-2xl font-bold text-teal mt-1">
          {score} / {quiz.length}
        </h1>
        <p className="text-sm text-muted mt-1">{moduleTitle}</p>

        <div className="flex flex-col gap-3 mt-6">
          {quiz.map((q, i) => {
            const correct = answers[i] === q.answer;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${correct ? "border-border-light" : "border-red-300 bg-red-50"}`}
              >
                <p className="text-sm font-medium text-teal">{q.question}</p>
                <p className="text-sm mt-1">
                  Your answer: <span className="font-semibold">{answers[i] ?? "—"}</span>
                  {!correct && (
                    <>
                      {" "}
                      · Correct: <span className="font-semibold text-teal">{q.answer}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted mt-1">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {!passed && (
            <button
              onClick={handleRetake}
              disabled={retaking}
              className="text-sm font-semibold text-teal border border-teal px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {retaking ? "Preparing focused review..." : "Retake with focused review"}
            </button>
          )}
          <Link
            href={continueHref}
            className="inline-block bg-teal text-cream font-semibold px-6 py-3 rounded-lg"
          >
            {continueLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <p className="text-xs tracking-widest text-teal">{isAdaptive ? "FOCUSED REVIEW" : "QUICK CHECK"}</p>
      <h1 className="text-2xl font-bold text-teal mt-1">{moduleTitle}</h1>
      <p className="text-sm text-muted mt-1">
        {isAdaptive
          ? "These questions target what you missed last time."
          : "A few questions before you move on."}
      </p>

      <div className="flex flex-col gap-5 mt-6">
        {quiz.map((q, i) => (
          <div key={i} className="rounded-xl border border-border-light bg-white p-4">
            <p className="text-sm font-medium text-teal">
              {i + 1}. {q.question}
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {q.options.map((opt) => {
                const selected = answers[i] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={`text-left text-sm px-3 py-2 rounded-lg border ${
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
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < quiz.length}
        className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-6 disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}
