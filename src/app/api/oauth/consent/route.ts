import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getIssuer } from "@/lib/oauth-config";

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

/** After user clicks Authorize — creates auth code and redirects back to client. */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const client_id = String(form.get("client_id") ?? "");
  const redirect_uri = String(form.get("redirect_uri") ?? "");
  const state = String(form.get("state") ?? "");
  const code_challenge = String(form.get("code_challenge") ?? "");
  const code_challenge_method = String(form.get("code_challenge_method") ?? "S256");
  const scope = String(form.get("scope") ?? "openid profile email");

  if (!client_id || !redirect_uri || !code_challenge) {
    return badRequest("missing_parameters");
  }
  if (code_challenge_method !== "S256" && code_challenge_method !== "plain") {
    return badRequest("unsupported_code_challenge_method");
  }

  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.redirect(new URL("/login", getIssuer()));
  }

  const client = await db.oAuthClient.findUnique({ where: { clientId: client_id } });
  if (!client || !client.isPublic) {
    return badRequest("invalid_client");
  }

  const allowed = client.redirectUris.some((u) => u === redirect_uri);
  if (!allowed) {
    return badRequest("invalid_redirect_uri");
  }

  const code = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60_000);

  await db.authCode.create({
    data: {
      code,
      clientId: client.clientId,
      userId: session.sub,
      redirectUri: redirect_uri,
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      scope,
      expiresAt,
    },
  });

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
