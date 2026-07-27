import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { sendMentorEmail } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendMentorEmail],
});
