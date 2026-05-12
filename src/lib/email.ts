import { Resend } from "resend";
import { getIssuer } from "./oauth-config";

const FROM_NAME = "ADOFAI Auth";

function publicBaseUrl(): string {
  return getIssuer();
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${from}>`,
    to: [to],
    subject,
    html,
  });

  if (error) {
    return { ok: false, error: `${error.name}: ${error.message}` };
  }
  return { ok: true, id: data?.id };
}

function emailTemplate(title: string, body: string, buttonText: string, buttonUrl: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#07070f;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#10101e;border:1px solid #1a1a35;border-radius:16px;padding:40px;">
        <tr><td align="center" style="padding-bottom:16px;">
          <h1 style="margin:0;font-size:22px;font-weight:900;color:#f0f0ff;">${title}</h1>
        </td></tr>
        <tr><td style="padding-bottom:28px;font-size:14px;color:#7777aa;line-height:1.7;text-align:center;">
          ${body}
        </td></tr>
        <tr><td align="center" style="padding-bottom:28px;">
          <a href="${buttonUrl}" style="display:inline-block;padding:12px 32px;border-radius:12px;font-weight:700;font-size:14px;color:white;background:linear-gradient(135deg,#ff2244,#ff8800);text-decoration:none;">
            ${buttonText}
          </a>
        </td></tr>
        <tr><td style="font-size:11px;color:#44445a;text-align:center;word-break:break-all;">
          ${buttonUrl}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${publicBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail(
    to,
    `Verify your account — ${FROM_NAME}`,
    emailTemplate(
      "Verify your email",
      `Welcome! Click below to verify. This link expires in 24 hours.`,
      "Verify email",
      link
    )
  );
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "guerrillamail.info",
  "trashmail.com",
  "fakeinbox.com",
  "dispostable.com",
  "spamgourmet.com",
  "maildrop.cc",
  "temp-mail.org",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}
