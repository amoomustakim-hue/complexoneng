import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Users, FileText, Quote } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export default async function ResearchPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/sign-in");

  const [requestCount, offerCount] = await Promise.all([
    prisma.researchRequest.count({ where: { profileId: profile.id } }),
    prisma.researchOffer.count({ where: { profileId: profile.id } }),
  ]);

  const stats = [
    {
      label: "Requests posted",
      value: requestCount > 0 ? String(requestCount) : "None yet",
      href: "/research/marketplace",
    },
    {
      label: "Offers sent",
      value: offerCount > 0 ? String(offerCount) : "None yet",
      href: "/research/marketplace",
    },
    {
      label: "AI research assistant",
      value: "Ready",
      href: "/research/assistant",
    },
  ];

  const modules = [
    {
      href: "/research/assistant",
      icon: Sparkles,
      title: "AI Research Assistant",
      body: "Get help with proposal structure, methodology, data analysis, and referencing.",
      cta: "Ask a question",
    },
    {
      href: "/research/proposal",
      icon: FileText,
      title: "Proposal Builder",
      body: "Answer a few prompts and get a structured research proposal draft in seconds.",
      cta: "Build a proposal",
    },
    {
      href: "/research/citations",
      icon: Quote,
      title: "Citation Formatter",
      body: "Format references in APA, MLA, Harvard, or Vancouver — instantly.",
      cta: "Format a citation",
    },
    {
      href: "/research/marketplace",
      icon: Users,
      title: "Research Marketplace",
      body: "Post a request for help, or offer your skills to other researchers.",
      cta:
        requestCount > 0
          ? `${requestCount} request${requestCount === 1 ? "" : "s"} posted`
          : "Browse or post",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
      <div>
        <p className="text-xs tracking-widest text-teal">RESEARCH SUPPORT</p>
        <h1 className="text-2xl font-bold text-teal mt-1">Research centre</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl bg-white p-5 hover:border-teal border border-border-light transition"
            style={{ boxShadow: "20px 20px 60px rgba(8,32,25,0.08), -8px -8px 30px rgba(255,255,255,0.7)" }}
          >
            <p className="text-xs text-muted tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-teal mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition flex flex-col justify-between gap-4"
            >
              <div>
                <Icon className="text-teal" size={22} />
                <h2 className="font-bold text-teal mt-3">{m.title}</h2>
                <p className="text-sm text-muted mt-1">{m.body}</p>
              </div>
              <span className="text-sm font-semibold text-teal">{m.cta} →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
