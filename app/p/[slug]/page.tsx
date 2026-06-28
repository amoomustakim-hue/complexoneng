import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await prisma.profile.findUnique({
    where: { portfolioSlug: slug },
    include: {
      certificates: { orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
      volunteering: { orderBy: { createdAt: "desc" } },
      researchOutputs: { orderBy: { createdAt: "desc" } },
      cbtSessions: true,
    },
  });

  if (!profile || !profile.portfolioPublic) {
    notFound();
  }

  const totalAttempts = profile.cbtSessions.length;
  const avgScore = totalAttempts
    ? Math.round(
        (profile.cbtSessions.reduce((acc, s) => acc + s.score / s.total, 0) / totalAttempts) * 100
      )
    : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border-light bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-teal text-lg">
          ComplexOne
        </Link>
        <Link
          href="/sign-up"
          className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
        >
          Build your own portfolio
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs tracking-widest text-teal">DIGITAL PORTFOLIO</p>
        <h1 className="text-3xl font-bold text-teal mt-1">{profile.fullName ?? "Student"}</h1>
        <p className="text-sm text-muted mt-1">
          {profile.school ?? ""}
          {profile.level ? ` · ${profile.level}` : ""}
          {profile.courseOfStudy ? ` · ${profile.courseOfStudy}` : ""}
          {profile.researchArea ? ` · ${profile.researchArea}` : ""}
        </p>

        {totalAttempts > 0 && (
          <div className="rounded-xl border border-border-light bg-white p-5 mt-6">
            <h2 className="font-bold text-teal">Academic record</h2>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs text-muted">CBT attempts</p>
                <p className="text-xl font-bold text-teal">{totalAttempts}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Average score</p>
                <p className="text-xl font-bold text-teal">{avgScore}%</p>
              </div>
            </div>
          </div>
        )}

        {profile.certificates.length > 0 && (
          <section className="mt-6">
            <h2 className="font-bold text-teal mb-2">Certificates</h2>
            <div className="flex flex-col gap-2">
              {profile.certificates.map((c) => (
                <div key={c.id} className="rounded-lg bg-white border border-border-light px-4 py-3">
                  <p className="text-sm font-medium text-teal">{c.title}</p>
                  <p className="text-xs text-muted">{c.issuer}</p>
                  {c.link && (
                    <a href={c.link} className="text-xs text-teal underline" target="_blank" rel="noopener noreferrer">
                      View certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.projects.length > 0 && (
          <section className="mt-6">
            <h2 className="font-bold text-teal mb-2">Projects</h2>
            <div className="flex flex-col gap-2">
              {profile.projects.map((p) => (
                <div key={p.id} className="rounded-lg bg-white border border-border-light px-4 py-3">
                  <p className="text-sm font-medium text-teal">{p.title}</p>
                  {p.description && <p className="text-xs text-muted mt-0.5">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} className="text-xs text-teal underline" target="_blank" rel="noopener noreferrer">
                      View project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.volunteering.length > 0 && (
          <section className="mt-6">
            <h2 className="font-bold text-teal mb-2">Volunteering experience</h2>
            <div className="flex flex-col gap-2">
              {profile.volunteering.map((v) => (
                <div key={v.id} className="rounded-lg bg-white border border-border-light px-4 py-3">
                  <p className="text-sm font-medium text-teal">
                    {v.role} at {v.organization}
                  </p>
                  {v.description && <p className="text-xs text-muted mt-0.5">{v.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.researchOutputs.length > 0 && (
          <section className="mt-6">
            <h2 className="font-bold text-teal mb-2">Research outputs</h2>
            <div className="flex flex-col gap-2">
              {profile.researchOutputs.map((r) => (
                <div key={r.id} className="rounded-lg bg-white border border-border-light px-4 py-3">
                  <p className="text-sm font-medium text-teal">{r.title}</p>
                  {r.description && <p className="text-xs text-muted mt-0.5">{r.description}</p>}
                  {r.link && (
                    <a href={r.link} className="text-xs text-teal underline" target="_blank" rel="noopener noreferrer">
                      View output
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
