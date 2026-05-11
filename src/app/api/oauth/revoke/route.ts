import { NextResponse } from "next/server";

/** Tokens are JWTs without server-side revocation list — stub for spec compliance. */
export async function POST() {
  return NextResponse.json({ message: "ok" });
}
