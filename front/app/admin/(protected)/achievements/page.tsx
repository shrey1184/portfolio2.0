import Link from "next/link";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAchievementAction,
  deleteAchievementAction,
  updateAchievementAction,
} from "@/app/admin/actions/achievements";
import { getAdminAchievements } from "@/lib/data/admin";

export default async function AdminAchievementsPage() {
  const achievements = await getAdminAchievements();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-8"><Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-sans underline">← Back to Live Editor</Link>
      <section>
        <h1 className="text-2xl font-semibold text-white">Achievements</h1>
        <p className="text-sm text-slate-400">Create and manage published achievements for the public portfolio.</p>
      </section>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Create Achievement</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAchievementAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Title</Label>
              <Input name="title" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea name="description" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Issuer</Label>
              <Input name="issuer" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Achieved At</Label>
              <Input name="achieved_at" type="date" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Achievement Image</Label>
              <ImageUploadField name="image_url" folder="achievements" />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_published" className="h-4 w-4 rounded border-slate-300" />
              Publish now
            </label>

            <div className="md:col-span-2">
              <SubmitButton label="Create Achievement" pendingLabel="Creating..." />
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="border-slate-800 bg-slate-900">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-white">{achievement.title}</CardTitle>
                <Badge variant={achievement.is_published ? "success" : "draft"}>
                  {achievement.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={updateAchievementAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={achievement.id} />

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Title</Label>
                  <Input name="title" defaultValue={achievement.title} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea name="description" defaultValue={achievement.description} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Issuer</Label>
                  <Input name="issuer" defaultValue={achievement.issuer} required />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Achieved At</Label>
                  <Input
                    name="achieved_at"
                    type="date"
                    defaultValue={achievement.achieved_at ? achievement.achieved_at.slice(0, 10) : ""}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Achievement Image</Label>
                  <ImageUploadField
                    name="image_url"
                    folder="achievements"
                    defaultValue={achievement.image_url}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Display Order</Label>
                  <Input name="order" type="number" min={1} defaultValue={achievement.order} required />
                </div>

                <label className="flex items-center gap-2 self-end text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={achievement.is_published}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Published
                </label>

                <div className="md:col-span-2">
                  <SubmitButton label="Save Changes" pendingLabel="Saving..." />
                </div>
              </form>

              <form action={deleteAchievementAction}>
                <input type="hidden" name="id" value={achievement.id} />
                <SubmitButton
                  label="Delete Achievement"
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
