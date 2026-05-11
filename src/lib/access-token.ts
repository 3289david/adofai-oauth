import { SignJWT, jwtVerify } from "jose";
import { getIssuer } from "./oauth-config";

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? "change-me-in-production");

export interface AccessPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  scope: string;
}

export async function issueAccessToken(p: AccessPayload): Promise<string> {
  const issuer = getIssuer();
  return new SignJWT({
    email: p.email,
    username: p.username,
    role: p.role,
    scope: p.scope,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.sub)
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret());
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: getIssuer(),
    });
    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      username: String(payload.username ?? ""),
      role: String(payload.role ?? ""),
      scope: String(payload.scope ?? ""),
    };
  } catch {
    return null;
  }
}
