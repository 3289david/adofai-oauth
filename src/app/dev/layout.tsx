import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer hub",
};

export default function DevSectionLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
