import { NextResponse } from "next/server";

/** Minimal JWKS placeholder — tokens are HS256; resource servers should verify via shared secret or fetch userinfo. */
export async function GET() {
  return NextResponse.json({ keys: [] });
}
