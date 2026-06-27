"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QUIZ_QUESTIONS,
  CAREER_INFO,
  type CareerCategory,
} from "@/lib/career-quiz";

export default function CareerQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CareerCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [topMatches, setTopMatches] = useState<{ category: CareerCategory; score: number }[] | null>(
    null
  );

  const question = QUIZ_QUESTIONS[step];

  async function selectOption(category: CareerCategory) {
    const next = [...answers, category];
    setAnswers(next);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/career/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: next }),
    });
    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      setTopMatches(data.topMatches);
    }
  }

  if (submitting) {
    return <p className="text-sm text-muted text-center py-12">Scoring your answers...</p>;
  }

  if (topMatches) {
    return (
      <div>
        <p className="text-xs tracking-widest text-teal">YOUR RESULTS</p>
        <h2 className="text-xl font-bold text-teal mt-1">Careers that match you</h2>

        <div className="flex flex-col gap-3 mt-6">
          {topMatches.map((m, i) => {
            const info = CAREER_INFO[m.category];
            return (
              <div key={m.category} className="rounded-xl border border-border-light bg-white p-5">
                <p className="text-xs font-semibold text-teal">
                  #{i + 1} match
                </p>
                <p className="font-bold text-teal mt-1">{info.label}</p>
                <p className="text-sm text-muted mt-1">{info.description}</p>
                <p className="text-xs text-muted mt-2">
                  Related courses: {info.courses.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            href="/career/scholarships"
            className="bg-teal text-cream font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            See related opportunities
          </Link>
          <Link
            href="/career/admissions"
            className="border border-teal text-teal font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Explore admissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted">
        Question {step + 1} of {QUIZ_QUESTIONS.length}
      </p>
      <h2 className="text-xl font-bold text-teal mt-1">{question.text}</h2>

      <div className="flex flex-col gap-2 mt-6">
        {question.options.map((opt) => (
          <button
            key={opt.category}
            onClick={() => selectOption(opt.category)}
            className="text-left text-sm px-4 py-3 rounded-lg border border-border-light text-teal hover:border-teal transition"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
