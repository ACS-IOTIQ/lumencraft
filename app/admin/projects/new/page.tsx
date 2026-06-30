import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getProjectEditorData } from "@/lib/admin-cms";
import { saveProjectAction } from "@/app/admin/actions";
import ProjectForm from "../_components/ProjectForm";

export default async function NewProjectPage() {
  await requireAdmin();
  const { categories } = await getProjectEditorData();

  return (
    <AdminShell title="New Project">
      <Link href="/admin/projects" className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black">
        ← All projects
      </Link>
      <ProjectForm categories={categories} action={saveProjectAction} />
    </AdminShell>
  );
}
