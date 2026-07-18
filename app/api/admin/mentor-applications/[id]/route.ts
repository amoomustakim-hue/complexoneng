import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { sendMentorRejectionEmail, sendMentorApprovalEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = (await req.json()) as { status?: string };

  if (status !== "APPROVED" && status !== "REJECTED" && status !== "PENDING") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const application = await prisma.mentorApplication.update({
    where: { id },
    data: { status },
  });

  // Sync isMentor on the matching Profile so the mentor immediately appears
  // (or disappears) in the student-facing mentor browser.
  if (status === "APPROVED") {
    await prisma.profile.updateMany({
      where: { email: application.email },
      data: {
        isMentor: true,
        mentorBio: application.bio,
        mentorExpertise: application.expertise,
      },
    });
    await sendMentorApprovalEmail(application.email, application.fullName).catch(() => {});
  } else if (status === "REJECTED") {
    await prisma.profile.updateMany({
      where: { email: application.email },
      data: { isMentor: false },
    });
    await sendMentorRejectionEmail(application.email, application.fullName).catch(() => {});
  } else {
    // reset to PENDING — revoke mentor status, no email
    await prisma.profile.updateMany({
      where: { email: application.email },
      data: { isMentor: false },
    });
  }

  return NextResponse.json({ application });
}
