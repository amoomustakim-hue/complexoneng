import Link from "next/link";
import { FlaskConical, Users, Briefcase, IdCard } from "lucide-react";

const STAGE_LABELS: Record<string, string> = {
  proposal: "Working on your proposal",
  data_collection: "Data collection",
  data_analysis: "Data analysis",
  writing_up: "Writing up",
  other: "In progress",
};

export default function ResearcherHome({
  firstName,
  researchArea,
  researchStage,
}: {
  firstName: string;
  researchArea?: string | null;
  researchStage?: string | null;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">RESEARCH WORKSPACE</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      {researchArea && (
        <p className="text-sm text-muted mt-1">
          {researchArea}
          {researchStage && ` · ${STAGE_LABELS[researchStage] ?? researchStage}`}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link
          href="/research"
          className="rounded-xl bg-teal text-cream p-6 flex flex-col justify-between shadow-neu"
        >
          <div>
            <FlaskConical size={22} />
            <p className="font-bold mt-3">Research Support Centre</p>
            <p className="text-sm opacity-75 mt-1">
              Proposal guidance, data analysis support, and the research marketplace.
            </p>
          </div>
          <span className="text-sm font-semibold mt-4">Open research hub →</span>
        </Link>

        <Link
          href="/community"
          className="rounded-xl border border-border-light bg-white p-6 flex flex-col justify-between hover:border-teal transition"
        >
          <div>
            <Users size={22} className="text-teal" />
            <p className="font-bold text-teal mt-3">Mentorship network</p>
            <p className="text-sm text-muted mt-1">
              Connect with supervisors, analysts, and fellow researchers.
            </p>
          </div>
          <span className="text-sm font-semibold text-teal mt-4">Find a mentor →</span>
        </Link>
      </div>

      <p className="text-xs tracking-widest text-muted mt-10">MORE FOR YOU</p>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Link
          href="/career"
          className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
        >
          <Briefcase className="text-teal" size={20} />
          <p className="text-xs font-medium text-teal">Career & Future Planning</p>
        </Link>
        <Link
          href="/portfolio"
          className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
        >
          <IdCard className="text-teal" size={20} />
          <p className="text-xs font-medium text-teal">Digital Portfolio</p>
        </Link>
      </div>

      <Link
        href="/academic/dashboard"
        className="block text-xs text-muted underline mt-8"
      >
        Need exam prep instead? Visit the Academic Hub →
      </Link>
    </div>
  );
}
