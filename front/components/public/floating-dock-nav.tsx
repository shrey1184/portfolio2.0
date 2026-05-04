import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Home,
  Github,
  FileText,
  Instagram,
  Mail,
  Twitter,
} from "lucide-react";

export function FloatingDockNav() {
  const links = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-white/80" />,
      href: "/", // Add your home link here
    },
    {
      title: "GitHub",
      icon: <Github className="h-full w-full text-white/80" />,
      href: "#", // Add your Github link here
    },
    {
      title: "Resume",
      icon: <FileText className="h-full w-full text-white/80" />,
      href: "#", // Add your resume link here
    },
    {
      title: "Instagram",
      icon: <Instagram className="h-full w-full text-white/80" />,
      href: "#", // Add your Instagram link here
    },
    {
      title: "Mail",
      icon: <Mail className="h-full w-full text-white/80" />,
      href: "#", // Add your email link here
    },
    {
      title: "Twitter",
      icon: <Twitter className="h-full w-full text-white/80" />,
      href: "#", // Add your Twitter/X link here
    },
  ];

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock items={links} />
    </div>
  );
}
