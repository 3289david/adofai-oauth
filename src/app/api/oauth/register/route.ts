import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";

const bodySchema = z.object({
  client_name: z.string().min(1).max(128),
  redirect_uris: z.array(z.string().url()).min(1).max(20),
  grant_types: z.array(z.enum(["authorization_code"])).optional(),
  token_endpoint_auth_method: z.enum(["none"]).optional(),
});

function cors(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/** CORS — any site may obtain a **public PKCE-only** OAuth client programmatically (open ecosystem). */
export async function OPTIONS(req: NextRequest) {
  const o = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: cors(o) });
}

/** OAuth 2.0 Dynamic Client Registration — PUBLIC clients only (PKCE). */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const clientId = `pub_${randomBytes(16).toString("hex")}`;

    const client = await db.oAuthClient.create({
      data: {
        clientId,
        name: data.client_name,
        redirectUris: data.redirect_uris,
        isPublic: true,
        clientSecretHash: null,
      },
    });

    return NextResponse.json(
      {
        client_id: client.clientId,
        client_name: client.name,
        client_secret_expires_at: 0,
        redirect_uris: client.redirectUris,
        grant_types: data.grant_types ?? ["authorization_code"],
        token_endpoint_auth_method: "none",
      },
      { status: 201, headers: cors(origin) }
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "invalid_client_metadata", detail: e.errors[0]?.message },
        { status: 400, headers: cors(origin) }
      );
    }
    return NextResponse.json({ error: "registration_failed" }, { status: 500, headers: cors(origin) });
  }
}
