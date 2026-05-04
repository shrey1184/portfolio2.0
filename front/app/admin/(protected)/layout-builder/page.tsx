import { LayoutBuilderEditor } from "@/components/admin/layout-builder-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveLayoutAction } from "@/app/admin/actions/layout-config";
import { getAdminLayoutSections } from "@/lib/data/admin";
import { HOMEPAGE_SECTIONS, type HomeSectionId } from "@/types/domain";

const normalizeSections = (value: unknown): HomeSectionId[] => {
  if (!Array.isArray(value)) {
    return [...HOMEPAGE_SECTIONS];
  }

  const sections = value.filter(
    (entry): entry is HomeSectionId =>
      typeof entry === "string" && HOMEPAGE_SECTIONS.includes(entry as HomeSectionId),
  );
  const unique = Array.from(new Set(sections));

  if (
    unique.length !== HOMEPAGE_SECTIONS.length ||
    !HOMEPAGE_SECTIONS.every((section) => unique.includes(section))
  ) {
    return [...HOMEPAGE_SECTIONS];
  }

  return unique;
};

export default async function AdminLayoutBuilderPage() {
  const dbValue = await getAdminLayoutSections();
  const sections = normalizeSections(dbValue);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-white">Layout Builder</h1>
        <p className="text-sm text-slate-400">Drag-and-drop homepage sections and persist order to Supabase JSON.</p>
      </section>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Homepage Order</CardTitle>
        </CardHeader>
        <CardContent>
          <LayoutBuilderEditor initialSections={sections} saveAction={saveLayoutAction} />
        </CardContent>
      </Card>
    </div>
  );
}
