"use client";

import { useEffect, useState } from "react";
import { BackgroundEffects } from "@/src/components/home/BackgroundEffects";
import {
  AboutSection,
  AchievementsSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
} from "@/src/components/home/HomeSections";
import { HoverCursor } from "@/src/components/home/HoverCursor";
import { StickyNavbar } from "@/src/components/home/StickyNavbar";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasHovered, setHasHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setHasHovered(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div className="relative cursor-default overflow-x-hidden font-sans text-white selection:bg-white selection:text-black golden-glow-theme">
      <HoverCursor x={mousePosition.x} y={mousePosition.y} visible={hasHovered} />

      <BackgroundEffects hasHovered={hasHovered} mouseX={mousePosition.x} mouseY={mousePosition.y} />

      <StickyNavbar />

      <main className="relative z-10 flex w-full flex-1 flex-col items-center">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
    </div>
  );
}
