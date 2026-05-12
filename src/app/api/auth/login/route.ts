import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/session";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit, getIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  turnstile: z.string().optional(),
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
  return_to: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (!rateLimit(`login:${ip}`, 3, 5 * 60_000, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many login attempts. Please wait before trying again." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const { email, password, turnstile, honeypot, formLoadedAt } = parsed;

    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (formLoadedAt && Date.now() - formLoadedAt < 1000) {
      return NextResponse.json({ error: "Form submitted too quickly. Please try again." }, { status: 400 });
    }

    const turnstileOk = await verifyTurnstile(turnstile, ip);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Human verification failed. Please complete the challenge." }, { status: 400 });
    }

    let returnTo = typeof parsed.return_to === "string" ? parsed.return_to : "/";
    if (!returnTo.startsWith("/")) returnTo = "/";

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        emailVerified: true,
        emailVerifyToken: true,
      },
    });

    if (!user) {
      await bcrypt.compare("x", "$2a$12$invalidhashforsecurityXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      if (!rateLimit(`login:user:${user.id}`, 3, 10 * 60_000, 2 * 60 * 60_000)) {
        return NextResponse.json({ error: "Too many failed attempts." }, { status: 429 });
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.emailVerified && user.emailVerifyToken) {
      return NextResponse.json({ error: "EMAIL_NOT_VERIFIED", email: user.email }, { status: 403 });
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      return_to: returnTo,
      username: user.username,
      email: user.email,
    });
    return setSessionCookie(res, token);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("[idp login]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
