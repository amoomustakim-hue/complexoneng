import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const certificate = await prisma.courseCertificate.findUnique({
    where: { certificateSlug: slug },
    include: { course: true, profile: true },
  });

  if (!certificate) {
    notFound();
  }

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

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="rounded-2xl border-4 border-teal bg-white p-10">
          <p className="text-xs tracking-widest text-teal">CERTIFICATE OF COMPLETION</p>
          <h1 className="font-[family-name:var(--font-instrument)] text-3xl text-teal mt-4">
            {certificate.profile.fullName ?? certificate.profile.email}
          </h1>
          <p className="text-sm text-muted mt-2">has successfully completed</p>
          <h2 className="text-xl font-bold text-teal mt-1">{certificate.course.title}</h2>
          <p className="text-xs text-muted mt-4">
            Issued{" "}
            {certificate.issuedAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-teal font-semibold mt-2">Verified by ComplexOne</p>
        </div>
      </div>
    </div>
  );
}
