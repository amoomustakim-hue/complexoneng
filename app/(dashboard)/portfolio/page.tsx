import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import VisibilityToggle from "@/components/portfolio/VisibilityToggle";
import PortfolioListSection from "@/components/portfolio/PortfolioListSection";

export default async function PortfolioPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const [certificates, projects, volunteering, researchOutputs, cbtSessions, courseCertificates] =
    await Promise.all([
      prisma.certificate.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: "desc" } }),
      prisma.project.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: "desc" } }),
      prisma.volunteeringExperience.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.researchOutput.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.cbtSession.findMany({ where: { profileId: profile.id } }),
      prisma.courseCertificate.findMany({
        where: { profileId: profile.id },
        orderBy: { issuedAt: "desc" },
        include: { course: true },
      }),
    ]);

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const totalAttempts = cbtSessions.length;
  const avgScore = totalAttempts
    ? Math.round(
        (cbtSessions.reduce((acc, s) => acc + s.score / s.total, 0) / totalAttempts) * 100
      )
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">DIGITAL PORTFOLIO</p>
      <h1 className="text-2xl font-bold text-teal mt-1">{profile.fullName ?? "Your portfolio"}</h1>
      <p className="text-sm text-muted mt-1">
        {profile.school ?? "No school set"}
        {profile.level ? ` · ${profile.level}` : ""}
        {profile.courseOfStudy ? ` · ${profile.courseOfStudy}` : ""}
      </p>

      <div className="mt-6">
        <VisibilityToggle
          initialPublic={profile.portfolioPublic}
          initialSlug={profile.portfolioSlug}
          baseUrl={baseUrl}
        />
      </div>

      <div className="rounded-xl border border-border-light bg-white p-5 mt-4">
        <h2 className="font-bold text-teal">Academic record</h2>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs text-muted">CBT attempts</p>
            <p className="text-xl font-bold text-teal">{totalAttempts}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Average score</p>
            <p className="text-xl font-bold text-teal">{avgScore !== null ? `${avgScore}%` : "—"}</p>
          </div>
        </div>
      </div>

      {courseCertificates.length > 0 && (
        <div className="rounded-xl border border-border-light bg-white p-5 mt-4">
          <h2 className="font-bold text-teal">Course certificates</h2>
          <div className="flex flex-col gap-2 mt-3">
            {courseCertificates.map((cert) => (
              <a
                key={cert.id}
                href={`/c/${cert.certificateSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-cream px-3 py-2 text-sm text-teal font-medium hover:underline"
              >
                {cert.course.title} — issued{" "}
                {cert.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        <PortfolioListSection
          title="Certificates"
          apiPath="/api/portfolio/certificates"
          responseKey="certificate"
          fields={[
            { key: "title", label: "Certificate title", type: "text", required: true },
            { key: "issuer", label: "Issued by", type: "text", required: true },
            { key: "dateIssued", label: "Date issued", type: "date" },
            { key: "link", label: "Link (optional)", type: "text" },
          ]}
          initialItems={certificates.map((c) => ({
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            dateIssued: c.dateIssued ? c.dateIssued.toISOString() : null,
            link: c.link,
          }))}
          renderSummary={(item) => ({
            heading: item.title ?? "",
            subheading: item.issuer ?? undefined,
          })}
        />

        <PortfolioListSection
          title="Projects"
          apiPath="/api/portfolio/projects"
          responseKey="project"
          fields={[
            { key: "title", label: "Project title", type: "text", required: true },
            { key: "description", label: "Description", type: "textarea" },
            { key: "link", label: "Link (optional)", type: "text" },
          ]}
          initialItems={projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            link: p.link,
          }))}
          renderSummary={(item) => ({
            heading: item.title ?? "",
            subheading: item.description ?? undefined,
          })}
        />

        <PortfolioListSection
          title="Volunteering experience"
          apiPath="/api/portfolio/volunteering"
          responseKey="volunteering"
          fields={[
            { key: "organization", label: "Organization", type: "text", required: true },
            { key: "role", label: "Role", type: "text", required: true },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          initialItems={volunteering.map((v) => ({
            id: v.id,
            organization: v.organization,
            role: v.role,
            description: v.description,
          }))}
          renderSummary={(item) => ({
            heading: `${item.role} at ${item.organization}`,
            subheading: item.description ?? undefined,
          })}
        />

        <PortfolioListSection
          title="Research outputs"
          apiPath="/api/portfolio/research-outputs"
          responseKey="researchOutput"
          fields={[
            { key: "title", label: "Title", type: "text", required: true },
            { key: "description", label: "Description", type: "textarea" },
            { key: "link", label: "Link (optional)", type: "text" },
          ]}
          initialItems={researchOutputs.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            link: r.link,
          }))}
          renderSummary={(item) => ({
            heading: item.title ?? "",
            subheading: item.description ?? undefined,
          })}
        />
      </div>
    </div>
  );
}
