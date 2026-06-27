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
          <div className="flex flex-col gap-3 mt-3">
            {applications.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-border-light bg-white p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-teal text-sm">{a.universityName}</p>
                  <p className="text-xs text-muted">
                    {a.program} · {a.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className="text-xs border border-border-light rounded-lg px-2 py-1.5 text-teal"
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
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
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
