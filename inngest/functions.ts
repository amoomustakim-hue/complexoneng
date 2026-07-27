import { inngest } from "@/lib/inngest";
import { sendMentorApprovalEmail, sendMentorRejectionEmail } from "@/lib/email";

export const sendMentorEmail = inngest.createFunction(
  { id: "send-mentor-email", retries: 3 },
  { event: "mentor/application.decided" },
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
