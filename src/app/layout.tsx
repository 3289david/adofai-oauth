import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADOFAI Auth — Sign in once for ADOFAI.NET & community apps",
  description:
    "Central identity & OAuth server for ADOFAI.NET maps, tournaments, and third-party integrations. Authorization Code + PKCE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <footer className="foot">
          “A Dance of Fire and Ice” and related marks belong to their owners. ADOFAI Auth is community infrastructure — not affiliated with
          publishers.
          <div style={{ marginTop: "0.75rem" }}>
            Questions? Read <Link href="/how-it-works">How it works</Link> ·{" "}
            <a href="https://github.com/3289david/adofai-oauth">Source code</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
