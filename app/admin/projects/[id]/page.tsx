import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getProjectEditorData } from "@/lib/admin-cms";
import { saveProjectAction, deleteProjectAction } from "@/app/admin/actions";
import ProjectForm from "../_components/ProjectForm";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const { categories, project } = await getProjectEditorData(id);

  if (!project) {
    return (
      <AdminShell title="Project Not Found">
        <p className="border border-black/10 bg-white p-6">This project no longer exists.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Edit: ${project.name}`}>
      <Link href="/admin/projects" className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black">
        ← All projects
      </Link>

      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Draft saved. Publish from the dashboard to make it live.
        </p>
      )}

      <ProjectForm categories={categories} project={project} action={saveProjectAction} />

      <form action={deleteProjectAction} className="mt-10 max-w-2xl border border-red-200 bg-red-50 p-6">
        <input type="hidden" name="id" value={project.id} />
        <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">Permanently delete this project. This cannot be undone.</p>
        <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-700 hover:text-white">
          Delete Project
        </button>
      </form>
    </AdminShell>
  );
}
