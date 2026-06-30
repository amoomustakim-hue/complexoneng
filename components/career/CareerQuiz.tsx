"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { QUIZ_QUESTIONS, CAREER_INFO, type CareerCategory } from "@/lib/career-quiz";

export default function CareerQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CareerCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [topMatches, setTopMatches] = useState<{ category: CareerCategory; score: number }[] | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[step];
  const progress = Math.round((step / QUIZ_QUESTIONS.length) * 100);

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
      if (data.aiExplanation) setAiExplanation(data.aiExplanation);
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setTopMatches(null);
    setAiExplanation(null);
  }

  if (submitting) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted">Scoring your answers and generating your career insight...</p>
      </div>
    );
  }

  if (topMatches) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs tracking-widest text-teal">YOUR RESULTS</p>
          <h2 className="text-xl font-bold text-teal mt-1">Careers that match you</h2>
        </div>

        <div className="flex flex-col gap-3">
          {topMatches.map((m, i) => {
            const info = CAREER_INFO[m.category];
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={m.category}
                className={`rounded-xl p-5 border ${i === 0 ? "border-teal bg-teal/5" : "border-border-light bg-white"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{medals[i]}</span>
                  <p className="font-bold text-teal">{info.label}</p>
                </div>
                <p className="text-sm text-muted mt-1">{info.description}</p>
                <p className="text-xs text-muted mt-2">
                  Nigerian university courses: {info.courses.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        {aiExplanation && (
          <div className="rounded-xl border border-border-light bg-cream/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-teal" />
              <p className="text-xs font-semibold text-teal tracking-wide">AI CAREER INSIGHT</p>
            </div>
            <p className="text-sm text-teal leading-relaxed whitespace-pre-line">{aiExplanation}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
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
          <button
            onClick={restart}
            className="text-sm text-muted underline px-2 py-2.5"
          >
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted">Question {step + 1} of {QUIZ_QUESTIONS.length}</p>
          <p className="text-xs text-muted">{progress}%</p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden">
          <div className="h-full bg-teal transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-teal">{question.text}</h2>

      <div className="flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.category}
            onClick={() => selectOption(opt.category)}
            className="text-left text-sm px-4 py-3 rounded-xl border border-border-light text-teal hover:border-teal hover:bg-cream/50 transition"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
