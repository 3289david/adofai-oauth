/** Issuer URL — MUST match public URL of this service (https://auth.adofai.net) */
export function getIssuer(): string {
  return (process.env.OAUTH_ISSUER ?? process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3010").replace(/\/$/, "");
}
