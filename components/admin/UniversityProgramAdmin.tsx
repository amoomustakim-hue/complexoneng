"use client";

import { useState } from "react";

type Program = {
  id: string;
  name: string;
  country: string;
  program: string;
  requirements: string | null;
  link: string | null;
};

export default function UniversityProgramAdmin({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [program, setProgram] = useState("");
  const [requirements, setRequirements] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addProgram(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, country, program, requirements, link }),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setPrograms((prev) => [data.program, ...prev]);
      setName("");
      setCountry("");
      setProgram("");
      setRequirements("");
      setLink("");
    }
  }

  async function deleteProgram(id: string) {
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <form onSubmit={addProgram} className="flex flex-wrap gap-2 mb-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="University name"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <input
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-32"
        />
        <input
          required
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          placeholder="Program"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <input
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Requirements"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (optional)"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {programs.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border-light bg-white p-3"
          >
            <div>
              <p className="text-sm font-semibold text-teal">{p.name}</p>
              <p className="text-xs text-muted">
                {p.country} · {p.program}
                {p.requirements ? ` · ${p.requirements}` : ""}
              </p>
            </div>
            <button
              onClick={() => deleteProgram(p.id)}
              className="text-xs text-red-600 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
        {programs.length === 0 && <p className="text-sm text-muted">No programs yet.</p>}
      </div>
    </div>
  );
}
