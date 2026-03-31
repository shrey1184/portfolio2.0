"use client";

import { useTransition } from "react";
import { updateThemeAction } from "@/app/admin/actions/theme";
import { SubmitButton } from "@/components/admin/submit-button";

export function ThemeEditor({ theme, onChange }: { theme: any, onChange: (t: any) => void }) {
  return (
    <form action={updateThemeAction} className="flex flex-col gap-3 font-sans w-64">
      <div className="flex justify-between items-center text-sm gap-2">
        <label className="text-slate-300">Primary</label>
        <input 
          type="color" 
          name="primary_color" 
          value={theme.primary_color} 
          onChange={(e) => onChange({ ...theme, primary_color: e.target.value })}
          className="h-8 w-12 rounded cursor-pointer bg-transparent border-0 p-0"
        />
      </div>
      <div className="flex justify-between items-center text-sm gap-2">
        <label className="text-slate-300">Secondary</label>
        <input 
          type="color" 
          name="secondary_color" 
          value={theme.secondary_color} 
          onChange={(e) => onChange({ ...theme, secondary_color: e.target.value })}
          className="h-8 w-12 rounded cursor-pointer bg-transparent border-0 p-0"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label className="text-slate-300">Font</label>
        <input 
          type="text" 
          name="font_family" 
          value={theme.font_family} 
          onChange={(e) => onChange({ ...theme, font_family: e.target.value })}
          className="rounded border border-slate-600 bg-slate-800 p-1 text-white text-xs"
        />
      </div>
      <div className="pt-2">
        <SubmitButton label="Save Theme" pendingLabel="Saving..." className="w-full text-xs py-1" />
      </div>
    </form>
  );
}
