"use client";

import React from "react";
import type { Achievement } from "@/types/domain";

interface AchievementListProps {
  achievements: Achievement[];
}

export const AchievementList = ({ achievements }: AchievementListProps) => {
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
    <div className="w-full max-w-5xl mx-auto py-20 px-4">
      {/* Header Section */}
      <div className="text-center mb-24">
        <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
          Honors & Awards
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 text-white">
          Recognition with actual signal.
        </h2>
        <p className="max-w-2xl mx-auto font-[family-name:var(--font-body)] text-sm md:text-base text-[var(--outline)] leading-relaxed">
          Notable finishes and industry recognition — verified results across global, national, and technical domains with real-world impact.
        </p>
      </div>

      {/* List Section */}
      <div className="flex flex-col">
        {achievements.map((item, index) => {
          const year = item.achieved_at ? new Date(item.achieved_at).getFullYear() : "";
          const number = (index + 1).toString().padStart(2, '0');
          
          return (
            <div 
              key={item.id} 
              className="group grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-white/5 last:border-b border-white/5"
            >
              {/* Numbering */}
              <div className="md:col-span-1 hidden md:block">
                <span className="font-[family-name:var(--font-body)] text-[11px] font-bold text-white/20 tracking-tighter">
                  {number}
                </span>
              </div>

              {/* Main Content */}
              <div className="md:col-span-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold uppercase tracking-wide text-white group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-wider text-white/60">
                    Verified
                  </span>
                </div>
                <p className="font-[family-name:var(--font-body)] text-[13px] md:text-sm leading-relaxed text-[var(--outline)] max-w-xl">
                  {item.description}
                </p>
              </div>

              {/* Issuer & Year */}
              <div className="md:col-span-3 flex flex-col md:items-end justify-start pt-1">
                <p className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-white/90 text-right">
                  {item.issuer}
                </p>
                <p className="font-[family-name:var(--font-body)] text-[10px] font-bold text-white/30 uppercase mt-1">
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


