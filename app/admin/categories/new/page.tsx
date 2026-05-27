import AdminShell from "@/components/admin/AdminShell";
import CategoryEditor from "@/components/admin/CategoryEditor";
import { requireAdmin } from "@/lib/auth";

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <AdminShell title="Add Category">
      <CategoryEditor category={null} />
    </AdminShell>
  );
}
