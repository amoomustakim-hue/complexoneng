"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Program = {
  id: string;
  name: string;
  country: string;
  program: string;
  requirements: string | null;
  link: string | null;
};

type Application = {
  id: string;
  universityName: string;
  country: string;
  program: string;
  status: string;
  deadline: string | null;
};

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "RESEARCHING", label: "Researching", color: "border-slate-300 bg-slate-50" },
  { key: "APPLYING", label: "Applying", color: "border-blue-300 bg-blue-50" },
  { key: "SUBMITTED", label: "Submitted", color: "border-amber-300 bg-amber-50" },
  { key: "ADMITTED", label: "Admitted", color: "border-emerald-300 bg-emerald-50" },
  { key: "REJECTED", label: "Rejected", color: "border-red-200 bg-red-50" },
];

const STATUS_LABELS: Record<string, string> = {
  RESEARCHING: "Researching",
  APPLYING: "Applying",
  SUBMITTED: "Submitted",
  ADMITTED: "Admitted",
  REJECTED: "Rejected",
};

export default function AdmissionTracker({
  programs,
  initialApplications,
}: {
  programs: Program[];
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);

  async function track(program: Program) {
    const res = await fetch("/api/career/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        universityName: program.name,
        country: program.country,
        program: program.program,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setApplications((prev) => [data.application, ...prev]);
    }
  }

  async function updateStatus(id: string, status: string) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/career/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/career/applications/${id}`, { method: "DELETE" });
  }

  const trackedKeys = new Set(applications.map((a) => `${a.universityName}::${a.program}`));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-bold text-teal">My applications</h2>
        {applications.length === 0 ? (
          <p className="text-sm text-muted mt-2">
            You&apos;re not tracking any applications yet. Browse programs below and add one.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-3 mt-3 min-w-max pb-2">
              {COLUMNS.map((col) => {
                const cards = applications.filter((a) => a.status === col.key);
                return (
                  <div
                    key={col.key}
                    className={`w-56 shrink-0 rounded-xl border p-3 ${col.color}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-teal tracking-wide">{col.label}</p>
                      <span className="text-xs text-muted bg-white/70 px-1.5 py-0.5 rounded-full">
                        {cards.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {cards.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-lg border border-white/80 bg-white p-3 shadow-sm"
                        >
                          <p className="font-semibold text-teal text-xs leading-snug">
                            {a.universityName}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {a.program} · {a.country}
                          </p>
                          {a.deadline && (
                            <p className="text-xs text-muted mt-1">
                              Due{" "}
                              {new Date(a.deadline).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <select
                              value={a.status}
                              onChange={(e) => updateStatus(a.id, e.target.value)}
                              className="text-xs border border-border-light rounded-md px-1.5 py-1 text-teal bg-white"
                            >
                              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => remove(a.id)}
                              aria-label="Remove application"
                              className="text-muted hover:text-red-600 ml-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-teal">Browse programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {programs.map((p) => {
            const tracked = trackedKeys.has(`${p.name}::${p.program}`);
            return (
              <div key={p.id} className="rounded-xl border border-border-light bg-white p-4">
                <p className="font-semibold text-teal text-sm">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.program} · {p.country}
                </p>
                {p.requirements && <p className="text-xs text-muted mt-2">{p.requirements}</p>}
                <button
                  onClick={() => track(p)}
                  disabled={tracked}
                  className="flex items-center gap-1 text-xs font-semibold text-teal mt-3 disabled:opacity-40"
                >
                  <Plus size={14} />
                  {tracked ? "Tracked" : "Track application"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
