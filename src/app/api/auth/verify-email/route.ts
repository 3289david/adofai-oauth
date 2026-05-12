import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response(page("Invalid link", "Missing token.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const user = await db.user.findFirst({
      where: { emailVerifyToken: token, emailVerifyExpiry: { gt: new Date() } },
    });

    if (!user) {
      return new Response(page("Expired", "Invalid or expired verification link.", false), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
    });

    return new Response(page("Verified", "You can close this tab and return to the site to sign in.", true), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new Response(page("Error", "Something went wrong.", false), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

function page(title: string, msg: string, ok: boolean): string {
  const c = ok ? "#44dd88" : "#ff2244";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title></head>
<body style="margin:0;background:#07070f;color:#f0f0ff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="max-width:420px;padding:2rem;text-align:center;border:1px solid #1a1a35;border-radius:1rem;background:#10101e">
<h1 style="color:${c}">${title}</h1><p style="color:#8888b0">${msg}</p></div></body></html>`;
}
