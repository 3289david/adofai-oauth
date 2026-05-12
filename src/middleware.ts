import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isDeveloperHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "dev.adofai.net" || h === "www.dev.adofai.net";
}

/** Point dev.adofai.net at this same Next deployment; "/" shows the developer hub. */
export function middleware(req: NextRequest) {
  if (!isDeveloperHost(req.headers.get("host") ?? "")) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/dev";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack|favicon.ico).*)"],
};
