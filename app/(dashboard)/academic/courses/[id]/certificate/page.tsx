import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const { id: courseId } = await params;

  const certificate = await prisma.courseCertificate.findUnique({
    where: { profileId_courseId: { profileId: profile.id, courseId } },
    include: { course: true },
  });

  if (!certificate) {
    notFound();
  }

  const shareUrl = `/c/${certificate.certificateSlug}`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="rounded-2xl border-4 border-teal bg-cream p-10">
        <p className="text-xs tracking-widest text-teal">CERTIFICATE OF COMPLETION</p>
        <h1 className="font-[family-name:var(--font-instrument)] text-3xl text-teal mt-4">
          {profile.fullName ?? profile.email}
        </h1>
        <p className="text-sm text-muted mt-2">has successfully completed</p>
        <h2 className="text-xl font-bold text-teal mt-1">{certificate.course.title}</h2>
        <p className="text-xs text-muted mt-4">
          Issued {certificate.issuedAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-teal font-semibold mt-2">ComplexOne</p>
      </div>

      <Link
        href={shareUrl}
        target="_blank"
        className="inline-block mt-6 text-sm font-semibold text-teal underline"
      >
        View shareable public link →
      </Link>
    </div>
  );
}
