import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { getThemeConfig } from "@/lib/data/public";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio CMS",
    template: "%s | Portfolio CMS",
  },
  description: "Personal portfolio with a private admin dashboard and CMS capabilities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeConfig().catch(() => ({
    id: 1,
    primary_color: "#0F766E",
    secondary_color: "#0F172A",
    font_family: "'Manrope', 'Segoe UI', sans-serif",
    updated_at: new Date().toISOString(),
  }));

  const style = {
    "--primary-color": theme.primary_color,
    "--secondary-color": theme.secondary_color,
    "--font-family": theme.font_family,
  } as CSSProperties;

  return (
    <html lang="en" className="scroll-smooth">
      <body style={style}>{children}</body>
    </html>
  );
}
