import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyPkce } from "@/lib/pkce";
import { issueAccessToken } from "@/lib/access-token";
import { getIssuer } from "@/lib/oauth-config";

function corsHeaders(origin: string | null) {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (origin) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const ct = req.headers.get("content-type") ?? "";
  let body: Record<string, string> = {};
  if (ct.includes("application/x-www-form-urlencoded")) {
    const t = await req.text();
    for (const pair of new URLSearchParams(t).entries()) {
      body[pair[0]] = pair[1];
    }
  } else {
    try {
      body = (await req.json()) as Record<string, string>;
    } catch {
      return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: corsHeaders(origin) });
    }
  }

  const grant = body.grant_type;
  if (grant !== "authorization_code") {
    return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400, headers: corsHeaders(origin) });
  }

  const code = body.code;
  const redirect_uri = body.redirect_uri;
  const client_id = body.client_id;
  const code_verifier = body.code_verifier;
  const client_secret = body.client_secret;

  if (!code || !redirect_uri || !client_id || !code_verifier) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: corsHeaders(origin) });
  }

  const row = await db.authCode.findUnique({
    where: { code },
    include: { client: true, user: true },
  });
  if (!row || row.usedAt) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400, headers: corsHeaders(origin) });
  }
  if (Date.now() > row.expiresAt.getTime()) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400, headers: corsHeaders(origin) });
  }
  if (row.redirectUri !== redirect_uri || row.clientId !== client_id) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400, headers: corsHeaders(origin) });
  }

  const client = row.client;
  if (client.isPublic) {
    if (client_secret) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401, headers: corsHeaders(origin) });
    }
  } else {
    if (!client.clientSecretHash || !client_secret) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401, headers: corsHeaders(origin) });
    }
    const ok = await bcrypt.compare(client_secret, client.clientSecretHash);
    if (!ok) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401, headers: corsHeaders(origin) });
    }
  }

  if (!verifyPkce(code_verifier, row.codeChallenge, row.codeChallengeMethod)) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400, headers: corsHeaders(origin) });
  }

  await db.authCode.update({ where: { id: row.id }, data: { usedAt: new Date() } });

  const issuer = getIssuer();
  const access_token = await issueAccessToken({
    sub: row.user.id,
    email: row.user.email,
    username: row.user.username,
    role: String(row.user.role),
    scope: row.scope,
  });

  return NextResponse.json(
    {
      access_token,
      token_type: "Bearer",
      expires_in: 3600,
      scope: row.scope,
      id_token: access_token,
    },
    { headers: corsHeaders(origin) }
  );
}
