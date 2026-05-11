import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADOFAI Auth — OAuth at auth.adofai.net",
  description: "Open OAuth 2.0 authorization server for the ADOFAI community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
