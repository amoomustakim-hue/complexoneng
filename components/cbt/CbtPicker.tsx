"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CbtPicker({
  exams,
  subjects,
  defaultExam,
}: {
  exams: string[];
  subjects: string[];
  defaultExam?: string;
}) {
  const router = useRouter();
  const [examType, setExamType] = useState(defaultExam ?? exams[0]);
  const [subject, setSubject] = useState(subjects[0]);

  function startExam() {
    router.push(`/academic/cbt/play?examType=${examType}&subject=${encodeURIComponent(subject)}`);
  }

  return (
    <div className="mt-6 bg-white border border-border-light rounded-xl p-6 flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-teal">Exam type</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          {exams.map((e) => (
            <option key={e} value={e}>
              {e.replace("_", "-")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-teal">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={startExam}
        className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-2"
      >
        Start practice
      </button>
    </div>
  );
}
