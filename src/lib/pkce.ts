import { createHash } from "crypto";

/** RFC 7636: BASE64URL(SHA256(code_verifier)) */
export function verifyPkce(codeVerifier: string, challenge: string, method: string): boolean {
  if (method === "plain") {
    return timingSafeEqualString(codeVerifier, challenge);
  }
  if (method === "S256") {
    const hash = createHash("sha256").update(codeVerifier).digest("base64url");
    return timingSafeEqualString(hash, challenge);
  }
  return false;
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
