import Link from "next/link";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/app/admin/actions/projects";
import { getAdminProjects } from "@/lib/data/admin";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-8"><Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-sans underline">← Back to Live Editor</Link>
      <section>
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="text-sm text-slate-400">CRUD, publish controls, storage uploads, and manual order updates.</p>
      </section>

      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProjectAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="new-project-title" className="text-slate-300">
                Title
              </Label>
              <Input id="new-project-title" name="title" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="new-project-description" className="text-slate-300">
                Description
              </Label>
              <Textarea id="new-project-description" name="description" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="new-project-tech" className="text-slate-300">
                Tech Stack (comma-separated)
              </Label>
              <Input id="new-project-tech" name="tech_stack" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Project Image</Label>
              <ImageUploadField name="image_url" folder="projects" />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_published" className="h-4 w-4 rounded border-slate-300" />
              Publish now
            </label>

            <div className="md:col-span-2">
              <SubmitButton label="Create Project" pendingLabel="Creating..." />
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="border-slate-800 bg-slate-900">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-white">{project.title}</CardTitle>
                <Badge variant={project.is_published ? "success" : "draft"}>
                  {project.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={updateProjectAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={project.id} />

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Title</Label>
                  <Input name="title" defaultValue={project.title} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea name="description" defaultValue={project.description} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Tech Stack (comma-separated)</Label>
                  <Input name="tech_stack" defaultValue={project.tech_stack.join(", ")} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Project Image</Label>
                  <ImageUploadField name="image_url" folder="projects" defaultValue={project.image_url} />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Display Order</Label>
                  <Input name="order" type="number" min={1} defaultValue={project.order} required />
                </div>

                <label className="flex items-center gap-2 self-end text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={project.is_published}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Published
                </label>

                <div className="md:col-span-2">
                  <SubmitButton label="Save Changes" pendingLabel="Saving..." />
                </div>
              </form>

              <form action={deleteProjectAction}>
                <input type="hidden" name="id" value={project.id} />
                <SubmitButton
                  label="Delete Project"
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
