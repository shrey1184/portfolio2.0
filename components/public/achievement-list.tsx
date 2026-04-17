"use client";

import React from "react";
import type { Achievement } from "@/types/domain";

interface AchievementListProps {
  achievements: Achievement[];
  borderColor?: string;
}

export const AchievementList = ({ achievements, borderColor }: AchievementListProps) => {
  if (achievements.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">
          NO RECOGNITION REGISTERED.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-4xl mx-auto py-12 px-6 border"
      style={{ borderColor: borderColor || 'var(--primary)', background: 'transparent' }}
    >
      {/* Header Section */}
      <div className="text-center mb-12">
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

      {/* List Section */}
      <div className="flex flex-col items-center">
        {achievements.map((item, index) => {
          const year = item.achieved_at ? new Date(item.achieved_at).getFullYear() : "";
          
          return (
            <div 
              key={item.id} 
              className="group w-full flex flex-col items-center py-6 border-t border-[var(--primary)] text-center"
            >
              {/* Main Content */}
              <div className="flex flex-col gap-2 items-center">
                <div className="flex items-center justify-center gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold uppercase tracking-wide text-[var(--primary)] group-hover:opacity-80 transition-colors">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--surface)] text-[8px] font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>
                <p className="font-[family-name:var(--font-body)] text-[12px] md:text-[13px] leading-relaxed text-[var(--outline)] max-w-xl">
                  {item.description}
                </p>
              </div>

              {/* Issuer & Year */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <p className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-wider text-[var(--outline)]">
                  {item.issuer}
                </p>
                <div className="w-1 h-1 bg-[var(--primary)] opacity-50 rounded-full" />
                <p className="font-[family-name:var(--font-body)] text-[10px] font-bold text-[var(--outline)] uppercase">
                  {year}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


