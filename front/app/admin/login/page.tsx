import type { Metadata } from "next";
import Link from "next/link";

import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/admin/actions/auth";

export const metadata: Metadata = {
  title: "Admin Login",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;
  const redirectTo = params.redirectTo ?? "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with the configured admin email to access the CMS.</p>

        {error ? (
          <p className="mt-4 rounded-md border border-red-900 bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Password
            </Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          <SubmitButton label="Sign In" pendingLabel="Signing in..." className="w-full" />
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Public portfolio remains available at <Link href="/" className="text-slate-300 hover:underline">/</Link>
        </p>
      </div>
    </div>
  );
}
