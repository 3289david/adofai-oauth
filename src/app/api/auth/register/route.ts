import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/session";

const schema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

function regUrl(req: NextRequest, code: string) {
  const u = new URL("/register", req.url);
  u.searchParams.set("error", code);
  return u;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const username = String(form.get("username") ?? "");
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    const parsed = schema.safeParse({ username, email, password });
    if (!parsed.success) {
      return NextResponse.redirect(regUrl(req, "invalid"));
    }

    const { username: u, email: em, password: pw } = parsed.data;

    const existing = await db.user.findFirst({
      where: { OR: [{ email: em }, { username: u }] },
    });
    if (existing) {
      return NextResponse.redirect(regUrl(req, "taken"));
    }

    const passwordHash = await bcrypt.hash(pw, 12);
    const user = await db.user.create({
      data: {
        username: u,
        email: em,
        passwordHash,
      },
    });

    const token = await signSession({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const res = NextResponse.redirect(new URL("/", req.url));
    return setSessionCookie(res, token);
  } catch {
    return NextResponse.redirect(regUrl(req, "failed"));
  }
}
