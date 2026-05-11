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

/** OAuth 2.0 Dynamic Client Registration (RFC 7591 subset) — PUBLIC clients only (PKCE). */
export async function POST(req: NextRequest) {
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
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_client_metadata", detail: e.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "registration_failed" }, { status: 500 });
  }
}
