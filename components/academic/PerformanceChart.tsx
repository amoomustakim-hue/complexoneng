"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Session = {
  id: string;
  subject: string;
  score: number;
  total: number;
  createdAt: string;
};

const COLORS = ["#0D3B2E", "#6B7B6E", "#B08968", "#3A6B5C"];

export default function PerformanceChart({ sessions }: { sessions: Session[] }) {
  const subjects = Array.from(new Set(sessions.map((s) => s.subject)));

  const dataByDate = new Map<string, Record<string, number | string>>();
  for (const s of sessions) {
    const date = new Date(s.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    const pct = Math.round((s.score / s.total) * 100);
    const row = dataByDate.get(date) ?? { date };
    row[s.subject] = pct;
    dataByDate.set(date, row);
  }

  const data = Array.from(dataByDate.values());

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-12">
        No CBT sessions yet. Practice a mock exam to see your progress here.
      </p>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E5" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7B6E" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6B7B6E" }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {subjects.map((subject, i) => (
            <Line
              key={subject}
              type="monotone"
              dataKey={subject}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
