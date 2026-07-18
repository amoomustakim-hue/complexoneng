import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "ComplexOne <onboarding@resend.dev>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendMentorRejectionEmail(to: string, name: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your ComplexOne mentor application",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0F2B6B">
        <p style="font-size:12px;letter-spacing:0.1em;color:#6b7280;margin-bottom:8px">COMPLEXONE</p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">Hi ${name},</h1>
        <p style="font-size:15px;line-height:1.6;margin:0 0 12px">
          Thank you for applying to become a mentor on ComplexOne. After careful review, we're
          unable to move your application forward at this time.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 12px">
          We receive many applications and have to make tough choices. This doesn't reflect your
          expertise — it simply means we couldn't offer you a spot in this round.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
          You're welcome to re-apply in the future as we open more spots.
        </p>
        <p style="font-size:14px;color:#6b7280">— The ComplexOne team</p>
      </div>
    `,
  });
}

export async function sendMentorApprovalEmail(to: string, name: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're now a ComplexOne mentor!",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0F2B6B">
        <p style="font-size:12px;letter-spacing:0.1em;color:#6b7280;margin-bottom:8px">COMPLEXONE</p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">Welcome, ${name}!</h1>
        <p style="font-size:15px;line-height:1.6;margin:0 0 12px">
          Congratulations — your mentor application has been approved. You're now listed as a
          mentor on ComplexOne.
        </p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 24px">
          Students can now book sessions with you. Log in to your dashboard to manage requests.
        </p>
        <p style="font-size:14px;color:#6b7280">— The ComplexOne team</p>
      </div>
    `,
  });
}
