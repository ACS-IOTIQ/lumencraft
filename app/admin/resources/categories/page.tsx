import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminBlogCategories } from "@/lib/admin-cms";

export default async function AdminBlogCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminBlogCategories();

  return (
    <AdminShell title="Resource Categories">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/resources" className="border border-black/20 px-4 py-2.5 text-sm font-medium hover:border-black">
          ← All Articles
        </Link>
        <Link href="/admin/resources/categories/new" className="bg-black px-5 py-3 text-sm font-semibold text-white">
          New Category
        </Link>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f5f5f3] text-left text-[11px] uppercase tracking-[0.12em] text-black/50">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Sort</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/40">
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-black/10">
                <td className="px-5 py-4 font-medium">{cat.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-black/60">{cat.slug}</td>
                <td className="px-5 py-4 text-black/60">{cat.sortOrder}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
                    cat.isActive ? "bg-green-50 text-green-700" : "bg-[#f5f5f3] text-black/50"
                  }`}>
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/resources/categories/${cat.id}`} className="font-semibold hover:text-black/60">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
