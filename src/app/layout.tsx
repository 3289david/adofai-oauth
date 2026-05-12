import type { Metadata } from "next";
import AppChrome from "@/components/AppChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ADOFAI Auth — Sign in once for ADOFAI.NET & community apps",
    template: "%s · ADOFAI Auth",
  },
  metadataBase: (() => {
    const raw =
      process.env.NEXT_PUBLIC_AUTH_ISSUER || process.env.OAUTH_ISSUER || "https://auth.adofai.net";
    try {
      return new URL(raw.replace(/\/+$/, ""));
    } catch {
      return new URL("https://auth.adofai.net");
    }
  })(),
  description:
    "Central identity & OAuth server for ADOFAI.NET maps, tournaments, and third-party integrations. Authorization Code + PKCE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
