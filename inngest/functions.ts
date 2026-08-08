import { inngest } from "@/lib/inngest";
import { sendMentorApprovalEmail, sendMentorRejectionEmail } from "@/lib/email";

export const sendMentorEmail = inngest.createFunction(
  { id: "send-mentor-email", retries: 3, triggers: [{ event: "mentor/application.decided" as const }] },
  async ({ event }) => {
    const { email, name, status } = event.data as {
      email: string;
      name: string;
      status: "APPROVED" | "REJECTED";
    };

    if (status === "APPROVED") {
      await sendMentorApprovalEmail(email, name);
    } else if (status === "REJECTED") {
      await sendMentorRejectionEmail(email, name);
    }
  }
);
