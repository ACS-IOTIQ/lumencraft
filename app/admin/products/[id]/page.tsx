import AdminShell from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";
import { deleteProductAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getProductEditorData } from "@/lib/admin-cms";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const data = await getProductEditorData(id);

  if (!data.product) {
    return (
      <AdminShell title="Product Not Found">
        <p className="border border-black/10 bg-white p-6">This product no longer exists.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Edit ${data.product.name}`}>
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Draft saved. Publish from the dashboard to make it live.
        </p>
      )}
      <ProductEditor product={data.product} categories={data.categories} mediaAssets={data.mediaAssets} />
      <form action={deleteProductAction} className="mt-10 border border-red-200 bg-red-50 p-6">
        <input type="hidden" name="id" value={data.product.id} />
        <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
        <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800">
          Delete Product
        </button>
      </form>
    </AdminShell>
  );
}
