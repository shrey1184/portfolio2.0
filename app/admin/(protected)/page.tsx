import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/data/admin";

const entries = [
  { href: "/admin/projects", label: "Manage Projects", description: "Create, edit, publish, reorder." },
  { href: "/admin/achievements", label: "Manage Achievements", description: "Track certifications and awards." },
  { href: "/admin/experience", label: "Manage Experience", description: "Maintain your work history." },
  { href: "/admin/layout-builder", label: "Layout Builder", description: "Drag and reorder homepage sections." },
  { href: "/admin/theme", label: "Theme", description: "Update global color and font settings." },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <section>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Portfolio content health and quick management links.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{stats.projectCount}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{stats.achievementCount}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{stats.experienceCount}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Draft Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-white">{stats.draftCount}</p>
            <Badge variant={stats.draftCount === 0 ? "success" : "draft"}>
              {stats.draftCount === 0 ? "All Published" : "Review Needed"}
            </Badge>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700 hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-white">{entry.label}</h2>
            <p className="mt-2 text-sm text-slate-400">{entry.description}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
