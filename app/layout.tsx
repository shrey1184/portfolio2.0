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
    primary_color: "#000000",
    secondary_color: "#f9f9f9",
    tertiary_color: "#777777",
    font_family: "'Space Grotesk', 'Inter', sans-serif",
    hero_video_url: "/globe.mp4",
    hero_video_opacity: 0.5,
    updated_at: new Date().toISOString(),
  }));

  const style = {
    "--primary": theme.primary_color,
    "--surface": theme.secondary_color,
    "--outline": theme.tertiary_color || "#777777",
    "--font-display": theme.font_family,
    "--font-body": theme.font_family.includes(',') ? theme.font_family.split(',').pop()?.trim() : theme.font_family,
    "--hero-video-opacity": theme.hero_video_opacity ?? 0.5,
  } as CSSProperties & { [key: string]: any };

  return (
    <html lang="en" className="scroll-smooth">
      <body style={style}>{children}</body>
    </html>
  );
}
