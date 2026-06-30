import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminProjects } from "@/lib/admin-cms";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const projects = await getAdminProjects();

  return (
    <AdminShell title="Projects">
      {params.saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Project saved. Publish from the dashboard to make it live.
        </p>
      )}
      {params.deleted && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Project deleted.
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-black/50">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-3">
          <Link
            href="/admin/projects/categories"
            className="border border-black/20 px-5 py-3 text-sm font-medium transition hover:border-black"
          >
            Manage Categories
          </Link>
          <Link
            href="/admin/projects/new"
            className="bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Add Project
          </Link>
        </div>
      </div>

      <div className="overflow-hidden border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Category</th>
              <th className="px-5 py-3 text-left font-semibold">Location</th>
              <th className="px-5 py-3 text-left font-semibold">Year</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-black/10 last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-black/40 font-mono">{project.slug}</p>
                  {project.isFeatured && (
                    <span className="mt-1 inline-block bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-black/60">{project.category.name}</td>
                <td className="px-5 py-4 text-black/60">{project.location}</td>
                <td className="px-5 py-4 text-black/60">{project.completionYear ?? "—"}</td>
                <td className="px-5 py-4">
                  {project.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-black/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/40">
                  No projects yet.{" "}
                  <Link href="/admin/projects/new" className="font-medium hover:underline">
                    Add one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
