import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/access-token";

function cors(origin: string | null, res: NextResponse) {
  if (origin) res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Authorization");
  return res;
}

export async function OPTIONS(req: NextRequest) {
  return cors(req.headers.get("origin"), new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return cors(origin, NextResponse.json({ error: "invalid_token" }, { status: 401 }));
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return cors(origin, NextResponse.json({ error: "invalid_token" }, { status: 401 }));
  }

  return cors(
    origin,
    NextResponse.json({
      sub: payload.sub,
      email: payload.email,
      preferred_username: payload.username,
      username: payload.username,
      role: payload.role,
    })
  );
}
