"use client";

import { useTransition } from "react";
import { updateThemeAction } from "@/app/admin/actions/theme";
import { SubmitButton } from "@/components/admin/submit-button";

import { MediaUploadField } from "@/components/admin/media-upload-field";

export function ThemeEditor({ theme, onChange }: { theme: any, onChange: (t: any) => void }) {
  return (
    <form action={updateThemeAction} className="flex flex-col gap-4 font-sans w-64 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-1">Colors</h3>
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
        <div className="flex justify-between items-center text-sm gap-2">
          <label className="text-slate-300">Text (Tertiary)</label>
          <input 
            type="color" 
            name="tertiary_color" 
            value={theme.tertiary_color || "#777777"} 
            onChange={(e) => onChange({ ...theme, tertiary_color: e.target.value })}
            className="h-8 w-12 rounded cursor-pointer bg-transparent border-0 p-0"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-1">Typography</h3>
        <div className="flex flex-col gap-1 text-sm">
          <label className="text-slate-300">Font Family</label>
          <input 
            type="text" 
            name="font_family" 
            value={theme.font_family} 
            onChange={(e) => onChange({ ...theme, font_family: e.target.value })}
            className="rounded border border-slate-600 bg-slate-800 p-1 text-white text-xs"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-1">Hero Media</h3>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Background Video</label>
          <MediaUploadField 
            name="hero_video_url" 
            folder="theme" 
            defaultValue={theme.hero_video_url}
            accept="video/*"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between text-xs">
            <label className="text-slate-300">Video Opacity</label>
            <span className="text-slate-500">{Math.round((theme.hero_video_opacity ?? 0.5) * 100)}%</span>
          </div>
          <input 
            type="range" 
            name="hero_video_opacity" 
            min="0" 
            max="1" 
            step="0.05"
            value={theme.hero_video_opacity ?? 0.5} 
            onChange={(e) => onChange({ ...theme, hero_video_opacity: parseFloat(e.target.value) })}
            className="w-full accent-[var(--primary)] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700 pb-1">Blob Tracing</h3>
        <div className="flex justify-between items-center text-sm gap-2">
          <label className="text-slate-300">Blob Color</label>
          <input 
            type="color" 
            name="blob_color" 
            value={theme.blob_color || "#FFFFFF"} 
            onChange={(e) => onChange({ ...theme, blob_color: e.target.value })}
            className="h-8 w-12 rounded cursor-pointer bg-transparent border-0 p-0"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between text-xs">
            <label className="text-slate-300">Blob Count</label>
            <span className="text-slate-500">{theme.blob_count ?? 10}</span>
          </div>
          <input 
            type="range" 
            name="blob_count" 
            min="1" 
            max="30" 
            step="1"
            value={theme.blob_count ?? 10} 
            onChange={(e) => onChange({ ...theme, blob_count: parseInt(e.target.value) })}
            className="w-full accent-[var(--primary)] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between text-xs">
            <label className="text-slate-300">Border Thickness</label>
            <span className="text-slate-500">{theme.blob_thickness ?? 1}px</span>
          </div>
          <input 
            type="range" 
            name="blob_thickness" 
            min="1" 
            max="10" 
            step="1"
            value={theme.blob_thickness ?? 1} 
            onChange={(e) => onChange({ ...theme, blob_thickness: parseInt(e.target.value) })}
            className="w-full accent-[var(--primary)] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between text-xs">
            <label className="text-slate-300">Blob Size</label>
            <span className="text-slate-500">{theme.blob_size ?? 80}px</span>
          </div>
          <input 
            type="range" 
            name="blob_size" 
            min="50" 
            max="300" 
            step="5"
            value={theme.blob_size ?? 80} 
            onChange={(e) => onChange({ ...theme, blob_size: parseInt(e.target.value) })}
            className="w-full accent-[var(--primary)] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between text-xs">
            <label className="text-slate-300">Trace Speed</label>
            <span className="text-slate-500">{theme.blob_speed ?? 4}</span>
          </div>
          <input 
            type="range" 
            name="blob_speed" 
            min="1" 
            max="10" 
            step="1"
            value={theme.blob_speed ?? 4} 
            onChange={(e) => onChange({ ...theme, blob_speed: parseInt(e.target.value) })}
            className="w-full accent-[var(--primary)] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="pt-2 sticky bottom-0 bg-slate-900/80 backdrop-blur-sm py-2">
        <SubmitButton label="Save Theme" pendingLabel="Saving..." className="w-full text-xs py-1" />
      </div>
    </form>
  );
}
