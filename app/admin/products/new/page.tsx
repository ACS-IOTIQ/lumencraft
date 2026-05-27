import AdminShell from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";
import { requireAdmin } from "@/lib/auth";
import { getProductEditorData } from "@/lib/admin-cms";

export default async function NewProductPage() {
  await requireAdmin();
  const data = await getProductEditorData();

  return (
    <AdminShell title="Add Product">
      <ProductEditor product={null} categories={data.categories} mediaAssets={data.mediaAssets} />
    </AdminShell>
  );
}
