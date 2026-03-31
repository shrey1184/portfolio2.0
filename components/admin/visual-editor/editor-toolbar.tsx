"use client";

import { ThemeEditor } from "./theme-editor";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { logoutAction } from "@/app/admin/actions/auth";
import Link from "next/link";
import { useState } from "react";
import { Settings, PenTool, Layout, LogOut } from "lucide-react";

export function EditorToolbar({ theme, setTheme }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open && (
        <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md w-72 origin-bottom-right animate-in fade-in zoom-in">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
             <h2 className="text-white font-bold text-sm tracking-widest uppercase">CMS Live Editor</h2>
             <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Theme Settings</h3>
            <ThemeEditor theme={theme} onChange={setTheme} />
          </div>

          <div className="border-t border-slate-700 pt-4 flex flex-col gap-2">
            <SignOutButton action={logoutAction} />
          </div>
        </div>
      )}
      
      {!open && (
        <button 
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-xl hover:scale-105 transition-transform"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
