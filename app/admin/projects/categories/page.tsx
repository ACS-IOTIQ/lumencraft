import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminProjectCategories } from "@/lib/admin-cms";

export default async function ProjectCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const categories = await getAdminProjectCategories();

  return (
    <AdminShell title="Project Categories">
      {params.saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Category saved successfully.
        </p>
      )}
      {params.deleted && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Category deleted.
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="text-sm font-medium text-black/50 hover:text-black">
            ← All projects
          </Link>
          <p className="text-sm text-black/50">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/projects/categories/new"
          className="bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
        >
          Add Category
        </Link>
      </div>

      <div className="overflow-hidden border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-left font-semibold">Slug</th>
              <th className="px-5 py-3 text-left font-semibold">Order</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-black/10 last:border-0">
                <td className="px-5 py-4 font-medium">{cat.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-black/50">{cat.slug}</td>
                <td className="px-5 py-4 text-black/60">{cat.sortOrder}</td>
                <td className="px-5 py-4">
                  {cat.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-black/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/projects/categories/${cat.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/40">
                  No categories yet.{" "}
                  <Link href="/admin/projects/categories/new" className="font-medium hover:underline">
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
