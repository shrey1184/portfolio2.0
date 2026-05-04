"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  pendingLabel?: string;
  children?: ReactNode;
}

export const SubmitButton = ({
  label,
  pendingLabel,
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={pending || disabled}
      {...props}
    >
      {children}
      {pending ? pendingLabel ?? "Saving..." : label}
    </button>
  );
};
