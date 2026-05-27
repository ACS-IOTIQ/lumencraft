import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/admin-cms";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();

  return (
    <AdminShell title="Products">
      <div className="mb-6 flex justify-end">
        <Link href="/admin/products/new" className="bg-black px-5 py-3 text-sm font-semibold text-white">
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f5f5f3] text-left text-[11px] uppercase tracking-[0.12em] text-black/50">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Downloads</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-black/10">
                <td className="px-5 py-4 font-medium">{product.name}</td>
                <td className="px-5 py-4 text-black/60">{product.category.name}</td>
                <td className="px-5 py-4 font-mono text-xs">{product.slug}</td>
                <td className="px-5 py-4 text-black/60">{product.downloads.length}/2 assigned</td>
                <td className="px-5 py-4">{product.isActive ? "Visible" : "Hidden"}</td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/products/${product.id}`} className="font-semibold hover:text-black/60">
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
