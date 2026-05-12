"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DevSiteNav from "@/components/DevSiteNav";
import SiteNav from "@/components/SiteNav";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDev = pathname.startsWith("/dev");

  return (
    <>
      {isDev ? <DevSiteNav /> : <SiteNav />}
      {children}
      <footer className={`foot ${isDev ? "foot-dev" : ""}`}>
        {isDev ? (
          <>
            ADOFAI developer docs — OAuth IdP infrastructure. Consumer help:{" "}
            <Link href="/how-it-works">How it works (players)</Link> ·{" "}
            <Link href="/">Production sign-in portal</Link> ·{" "}
            <a href="https://github.com/3289david/adofai-oauth">GitHub — adofai-oauth</a>
          </>
        ) : (
          <>
            “A Dance of Fire and Ice” and related marks belong to their owners. ADOFAI Auth is community infrastructure — not affiliated with
            publishers.
            <div style={{ marginTop: "0.75rem" }}>
              Questions? Read <Link href="/how-it-works">How it works</Link> ·{" "}
              <Link href="/dev">Developers · dev.adofai.net</Link> ·{" "}
              <a href="https://github.com/3289david/adofai-oauth">Source code</a>
            </div>
          </>
        )}
      </footer>
    </>
  );
}
