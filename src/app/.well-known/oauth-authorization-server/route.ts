import { NextResponse } from "next/server";
import { getIssuer } from "@/lib/oauth-config";

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414).
 * https://auth.adofai.net/.well-known/oauth-authorization-server
 */
export async function GET() {
  const issuer = getIssuer();
  const body = {
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/api/oauth/token`,
    registration_endpoint: `${issuer}/api/oauth/register`,
    userinfo_endpoint: `${issuer}/api/oauth/userinfo`,
    revocation_endpoint: `${issuer}/api/oauth/revoke`,
    jwks_uri: `${issuer}/api/oauth/jwks`,
    scopes_supported: ["openid", "profile", "email"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256", "plain"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
    subject_types_supported: ["public"],
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
