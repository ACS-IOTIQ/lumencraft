import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.productCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <AdminShell title="Categories">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/categories/new"
          className="bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          Add Category
        </Link>
      </div>
      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f5f5f3] text-left text-[11px] uppercase tracking-[0.12em] text-black/50">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Icon</th>
              <th className="px-5 py-4">Products</th>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-black/10">
                <td className="px-5 py-4 font-medium">{cat.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-black/60">{cat.slug}</td>
                <td className="px-5 py-4 text-black/60">{cat.icon}</td>
                <td className="px-5 py-4 text-black/60">{cat._count.products}</td>
                <td className="px-5 py-4 text-black/60">{cat.sortOrder}</td>
                <td className="px-5 py-4">{cat.isActive ? "Visible" : "Hidden"}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/categories/${cat.id}`}
                    className="font-semibold hover:text-black/60"
                  >
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
