import Link from "next/link";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createExperienceAction,
  deleteExperienceAction,
  updateExperienceAction,
} from "@/app/admin/actions/experience";
import { getAdminExperience } from "@/lib/data/admin";

export default async function AdminExperiencePage() {
  const experience = await getAdminExperience();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-8"><Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-sans underline">← Back to Live Editor</Link>
      <section>
        <h1 className="text-2xl font-semibold text-white">Experience</h1>
        <p className="text-sm text-slate-400">Manage role history entries and publish to the public pages.</p>
      </section>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Create Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createExperienceAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Company</Label>
              <Input name="company" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Role</Label>
              <Input name="role" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Summary</Label>
              <Textarea name="summary" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Location</Label>
              <Input name="location" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Start Date</Label>
              <Input name="start_date" type="date" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">End Date</Label>
              <Input name="end_date" type="date" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Experience Image</Label>
              <ImageUploadField name="image_url" folder="experience" />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_published" className="h-4 w-4 rounded border-slate-300" />
              Publish now
            </label>

            <div className="md:col-span-2">
              <SubmitButton label="Create Experience" pendingLabel="Creating..." />
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {experience.map((item) => (
          <Card key={item.id} className="border-slate-800 bg-slate-900">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-white">{item.role}</CardTitle>
                <Badge variant={item.is_published ? "success" : "draft"}>
                  {item.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={updateExperienceAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />

                <div className="space-y-2">
                  <Label className="text-slate-300">Company</Label>
                  <Input name="company" defaultValue={item.company} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <Input name="role" defaultValue={item.role} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Summary</Label>
                  <Textarea name="summary" defaultValue={item.summary} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Location</Label>
                  <Input name="location" defaultValue={item.location} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Start Date</Label>
                  <Input name="start_date" type="date" defaultValue={item.start_date.slice(0, 10)} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">End Date</Label>
                  <Input name="end_date" type="date" defaultValue={item.end_date ? item.end_date.slice(0, 10) : ""} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Experience Image</Label>
                  <ImageUploadField name="image_url" folder="experience" defaultValue={item.image_url} />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Display Order</Label>
                  <Input name="order" type="number" min={1} defaultValue={item.order} required />
                </div>

                <label className="flex items-center gap-2 self-end text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={item.is_published}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Published
                </label>

                <div className="md:col-span-2">
                  <SubmitButton label="Save Changes" pendingLabel="Saving..." />
                </div>
              </form>

              <form action={deleteExperienceAction}>
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton
                  label="Delete Experience"
                  pendingLabel="Deleting..."
                  className="bg-red-600 hover:bg-red-700"
                />
              </form>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
