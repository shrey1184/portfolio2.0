"use client";

import React from "react";
import type { Achievement } from "@/types/domain";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementListProps {
  achievements: Achievement[];
  borderColor?: string;
}

// Hardcoded achievements from user request
const HARDCODED_ACHIEVEMENTS = [
  { id: "1", title: "NASA Space Apps Challenge 2024 – Winner & Global Nominee", description: "Won at the national level and advanced as a global nominee in the NASA Space Apps Challenge, competing against international teams to solve real-world space and Earth science problems using technology.", issuer: "NASA", year: "2024" },
  { id: "2", title: "TSATS 2025 – Finalist (Indian Army)", description: "Selected as a finalist in the Technical Symposium of Army Training Schools, demonstrating technical innovation and problem-solving in a highly competitive defense-oriented environment.", issuer: "Indian Army", year: "2025" },
  { id: "3", title: "Smart India Hackathon (SIH) – Finalist", description: "Reached the final stage of Smart India Hackathon, one of India’s largest national hackathons, by developing a scalable and impactful technical solution.", issuer: "SIH", year: "" },
  { id: "4", title: "Mumbai Hacks 2025 – Finalist", description: "Finalist in Mumbai Hacks, competing among top developers and innovators to build high-impact solutions under time constraints.", issuer: "Mumbai Hacks", year: "2025" },
  { id: "5", title: "CodeSlayer (NIT Delhi) – Top 10", description: "Ranked among the top 10 teams in CodeSlayer hosted by National Institute of Technology Delhi, showcasing strong algorithmic and development skills.", issuer: "NIT Delhi", year: "" },
  { id: "6", title: "EY Hackathon – Round 1 Qualified", description: "Qualified the initial screening round of Ernst & Young hackathon, indicating strong problem-solving and business-technical alignment.", issuer: "Ernst & Young", year: "" },
  { id: "7", title: "AWS AI for Bharat Hackathon – Semi-Finalist", description: "Advanced to the semi-final stage of the AWS AI for Bharat Hackathon, working on AI-driven solutions focused on Indian use cases and scalability.", issuer: "AWS", year: "" },
  { id: "8", title: "Skill Climax Hackathon – Finalist (Round 3)", description: "Reached Round 3 (finalist stage) in the Skill Climax Hackathon, demonstrating consistency across multiple evaluation rounds involving technical and practical challenges.", issuer: "Skill Climax", year: "" },
  { id: "9", title: "Invited Speaker – Delhi University", description: "Invited to speak at University of Delhi, recognizing expertise and contributions in technology and innovation.", issuer: "Delhi University", year: "" },
  { id: "10", title: "Youth Icon Award – OIST", description: "Received the Youth Icon Award at Oriental Institute of Science and Technology for overall excellence in academics, leadership, and extracurricular impact.", issuer: "OIST", year: "" },
  { id: "11", title: "McKinsey Forward Program – Graduate", description: "Completed the McKinsey & Company Forward Program, gaining training in structured problem-solving, leadership, and business fundamentals.", issuer: "McKinsey & Company", year: "" }
];

export const AchievementList = ({ achievements, borderColor }: AchievementListProps) => {
  // Combine DB achievements and hardcoded ones, or just use hardcoded if DB is empty
  const displayAchievements = achievements.length > 0 ? achievements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    issuer: a.issuer,
    year: a.achieved_at ? new Date(a.achieved_at).getFullYear().toString() : ""
  })) : HARDCODED_ACHIEVEMENTS;

  /*
   * ==========================================
   * GLASSMORPHISM CUSTOMIZATION GUIDE:
   * ==========================================
   * To change transparency:
   * Modify the `bg-white/10` or `bg-black/10` utility classes below. 
   * The number after the slash (e.g., /10, /20, /30) represents opacity percentage.
   * Lower number = more transparent. Higher number = less transparent.
   * 
   * To change blurriness:
   * Modify the `backdrop-blur-md` utility class.
   * Options available: backdrop-blur-sm, backdrop-blur-md, backdrop-blur-lg, backdrop-blur-xl
   * Higher suffix = more blurred background.
   * ==========================================
   */
  const glassClasses = "bg-[var(--surface)]/10 backdrop-blur-md border border-[var(--primary)]/30 rounded-2xl shadow-xl";

  return (
    <div className="relative flex w-[100vw] ml-[calc(50%-50vw)] flex-col items-center justify-center py-12">
      <div
        className={cn(
          "absolute inset-0 z-0 opacity-20",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--outline)_1px,transparent_1px),linear-gradient(to_bottom,var(--outline)_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-[var(--surface)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
        <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
          Honors & Awards
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 text-[var(--primary)]">
          Recognition with actual signal.
        </h2>
        <p className="max-w-2xl mx-auto font-[family-name:var(--font-body)] text-xs md:text-sm text-[var(--outline)] leading-relaxed">
          Notable finishes and industry recognition — verified results across global, national, and technical domains with real-world impact.
        </p>
      </div>

      {/* Grid List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {displayAchievements.map((item) => (
          <div 
            key={item.id} 
            className="group relative w-full h-[320px] [perspective:1000px] cursor-pointer"
          >
            {/* Inner Flip Container */}
            <div className="w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] relative">
              
              {/* === Front Face === */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] ${glassClasses}`}>
                <div className="bg-[var(--primary)]/10 p-4 rounded-full mb-6 text-[var(--primary)]">
                  <Trophy className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl font-bold uppercase tracking-wide text-[var(--primary)] text-center">
                  {item.title}
                </h3>
              </div>

              {/* === Back Face === */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] ${glassClasses}`}
              >
                <div className="flex flex-col h-full justify-between items-center text-center">
                  <div className="flex-1 flex items-center">
                    <p className="font-[family-name:var(--font-body)] text-[13px] md:text-sm leading-relaxed text-[var(--tertiary)] opacity-90">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Issuer & Year Footer */}
                  <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[var(--primary)]/20 w-full">
                    {item.issuer && (
                      <p className="font-[family-name:var(--font-display)] text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                        {item.issuer}
                      </p>
                    )}
                    {item.issuer && item.year && (
                      <div className="w-1 h-1 bg-[var(--primary)] opacity-50 rounded-full" />
                    )}
                    {item.year && (
                      <p className="font-[family-name:var(--font-body)] text-[10px] font-bold text-[var(--outline)] uppercase">
                        {item.year}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};


