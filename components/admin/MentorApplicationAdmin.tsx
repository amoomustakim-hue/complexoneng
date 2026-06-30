"use client";

import { useState } from "react";

type Application = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string | null;
  expertise: string;
  bio: string;
  linkedin: string | null;
  status: string;
  createdAt: string;
};

export default function MentorApplicationAdmin({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function setStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/mentor-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);

    if (res.ok) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  }

  if (applications.length === 0) {
    return <p className="text-sm text-muted">No mentor applications yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="rounded-lg border border-border-light bg-white p-4 flex flex-col gap-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-teal">{app.fullName}</p>
              <p className="text-xs text-muted">
                {app.email}
                {app.whatsapp ? ` · ${app.whatsapp}` : ""}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                app.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : app.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {app.status}
            </span>
          </div>
          <p className="text-xs text-muted">
            <span className="font-medium text-teal">Expertise:</span> {app.expertise}
          </p>
          <p className="text-xs text-muted leading-relaxed">{app.bio}</p>
          {app.linkedin && (
            <a
              href={app.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal underline w-fit"
            >
              {app.linkedin}
            </a>
          )}
          {app.status === "PENDING" && (
            <div className="flex gap-2 mt-1">
              <button
                disabled={updatingId === app.id}
                onClick={() => setStatus(app.id, "APPROVED")}
                className="text-xs bg-teal text-cream font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={updatingId === app.id}
                onClick={() => setStatus(app.id, "REJECTED")}
                className="text-xs border border-border-light text-teal font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
          {app.status !== "PENDING" && (
            <button
              disabled={updatingId === app.id}
              onClick={() => setStatus(app.id, "PENDING")}
              className="text-xs text-muted underline w-fit disabled:opacity-50"
            >
              Reset to pending
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
