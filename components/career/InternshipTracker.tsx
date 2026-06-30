"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

type Application = {
  id: string;
  company: string;
  role: string;
  industry: string | null;
  location: string | null;
  status: string;
  deadline: string | null;
};

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "APPLIED", label: "Applied", color: "border-blue-200 bg-blue-50" },
  { key: "INTERVIEW", label: "Interview", color: "border-amber-200 bg-amber-50" },
  { key: "OFFER", label: "Offer", color: "border-emerald-200 bg-emerald-50" },
  { key: "REJECTED", label: "Rejected", color: "border-red-200 bg-red-50" },
];

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export default function InternshipTracker({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addApplication(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/career/internship-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, industry, location, deadline }),
    });
    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      setApplications((prev) => [
        {
          ...data.application,
          deadline: data.application.deadline ?? null,
        },
        ...prev,
      ]);
      setCompany("");
      setRole("");
      setIndustry("");
      setLocation("");
      setDeadline("");
      setShowForm(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/career/internship-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/career/internship-applications/${id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {applications.length > 0
            ? `${applications.length} application${applications.length === 1 ? "" : "s"} tracked`
            : "No applications tracked yet."}
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add application"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addApplication} className="rounded-xl border border-border-light bg-white p-5 space-y-3">
          <p className="text-sm font-semibold text-teal">Log a new application</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">Company <span className="text-red-500">*</span></label>
              <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Flutterwave" className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-xs text-muted">Role <span className="text-red-500">*</span></label>
              <input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Engineering Intern" className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-xs text-muted">Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Fintech" className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-xs text-muted">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lagos / Remote" className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            </div>
            <div>
              <label className="text-xs text-muted">Application deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="bg-teal text-cream font-semibold px-5 py-2 rounded-lg text-sm disabled:opacity-50">
            {submitting ? "Saving..." : "Save application"}
          </button>
        </form>
      )}

      {applications.length > 0 && (
        <div className="overflow-x-auto -mx-6 px-6">
          <div className="flex gap-3 min-w-max pb-2">
            {COLUMNS.map((col) => {
              const cards = applications.filter((a) => a.status === col.key);
              return (
                <div key={col.key} className={`w-56 shrink-0 rounded-xl border p-3 ${col.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-teal tracking-wide">{col.label}</p>
                    <span className="text-xs text-muted bg-white/70 px-1.5 py-0.5 rounded-full">
                      {cards.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {cards.map((a) => (
                      <div key={a.id} className="rounded-lg border border-white/80 bg-white p-3 shadow-sm">
                        <p className="font-semibold text-teal text-xs leading-snug">{a.company}</p>
                        <p className="text-xs text-muted mt-0.5">{a.role}</p>
                        {a.industry && <p className="text-xs text-muted">{a.industry}</p>}
                        {a.location && <p className="text-xs text-muted">{a.location}</p>}
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
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                          <button onClick={() => remove(a.id)} aria-label="Remove" className="text-muted hover:text-red-600 ml-1">
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
  );
}
