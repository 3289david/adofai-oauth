import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ADOFAI Account — One account for all of ADOFAI",
    template: "%s · ADOFAI Account",
  },
  description:
    "Create a free ADOFAI account and sign in to ADOFAI.NET, online tournaments, and community sites — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <footer className="foot">
          &ldquo;A Dance of Fire and Ice&rdquo; and related marks belong to their respective owners. ADOFAI Account is community infrastructure &mdash; not affiliated with the publishers.
          <div style={{ marginTop: "0.75rem" }}>
            <Link href="/how-it-works">Help</Link>
            {" · "}
            <a href="https://adofai.net">ADOFAI.NET</a>
            {" · "}
            <a href="https://github.com/3289david/adofai-oauth">Open source</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
