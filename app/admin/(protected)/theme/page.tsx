import { SubmitButton } from "@/components/admin/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateThemeAction } from "@/app/admin/actions/theme";
import { getAdminThemeConfig } from "@/lib/data/admin";

const fallbackTheme = {
  primary_color: "#0F766E",
  secondary_color: "#0F172A",
  font_family: "'Manrope', 'Segoe UI', sans-serif",
};

export default async function AdminThemePage() {
  const theme = (await getAdminThemeConfig()) ?? fallbackTheme;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-white">Theme</h1>
        <p className="text-sm text-slate-400">Update global color variables and font family for all public pages.</p>
      </section>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateThemeAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Color</Label>
              <Input name="primary_color" type="color" defaultValue={theme.primary_color} className="h-12" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Secondary Color</Label>
              <Input
                name="secondary_color"
                type="color"
                defaultValue={theme.secondary_color}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Font Family CSS Value</Label>
              <Input name="font_family" defaultValue={theme.font_family} required />
            </div>

            <div className="md:col-span-2 rounded-lg border border-slate-700 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Preview</p>
              <p style={{ color: theme.secondary_color, fontFamily: theme.font_family }} className="mt-2 text-xl font-semibold">
                Portfolio Heading Preview
              </p>
              <p style={{ color: theme.primary_color, fontFamily: theme.font_family }} className="mt-2 text-sm">
                Primary color and font-family will apply globally through CSS variables.
              </p>
            </div>

            <div className="md:col-span-2">
              <SubmitButton label="Save Theme" pendingLabel="Saving..." />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
