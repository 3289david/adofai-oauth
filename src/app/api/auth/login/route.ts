import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/session";

function loginUrl(req: NextRequest, returnTo: string, error?: string) {
  const u = new URL("/login", req.url);
  u.searchParams.set("return_to", returnTo);
  if (error) u.searchParams.set("error", error);
  return u;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  let returnTo = String(form.get("return_to") ?? "/");
  if (!returnTo.startsWith("/")) returnTo = "/";

  if (!email || !password) {
    return NextResponse.redirect(loginUrl(req, returnTo, "missing"));
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    await bcrypt.compare("x", "$2a$12$invalidhashforsecurityXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    return NextResponse.redirect(loginUrl(req, returnTo, "invalid"));
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.redirect(loginUrl(req, returnTo, "invalid"));
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  const res = NextResponse.redirect(new URL(returnTo, req.url));
  return setSessionCookie(res, token);
}
