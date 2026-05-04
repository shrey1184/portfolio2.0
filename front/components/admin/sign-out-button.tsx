"use client";

import { LogOut } from "lucide-react";

import { SubmitButton } from "@/components/admin/submit-button";

interface SignOutButtonProps {
  action: (formData: FormData) => Promise<void>;
}

export const SignOutButton = ({ action }: SignOutButtonProps) => {
  return (
    <form action={action}>
      <SubmitButton
        label="Sign Out"
        pendingLabel="Signing out..."
        className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
};
