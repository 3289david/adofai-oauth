import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (!rateLimit(`resend:${ip}`, 3, 5 * 60_000, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user) return NextResponse.json({ ok: true });
    if (user.emailVerified) return NextResponse.json({ ok: true, alreadyVerified: true });

    const token = randomBytes(32).toString("hex");
    const exp = new Date(Date.now() + 24 * 60 * 60_000);

    await db.user.update({ where: { id: user.id }, data: { emailVerifyToken: token, emailVerifyExpiry: exp } });

    const mail = await sendVerificationEmail(user.email, token);
    if (!mail.ok) {
      return NextResponse.json({ error: mail.error ?? "Failed to send" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[resend]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
