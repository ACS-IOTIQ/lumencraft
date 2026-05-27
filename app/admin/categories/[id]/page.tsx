import AdminShell from "@/components/admin/AdminShell";
import CategoryEditor from "@/components/admin/CategoryEditor";
import { deleteCategoryAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const category = await prisma.productCategory.findUnique({ where: { id } });

  if (!category) {
    return (
      <AdminShell title="Category Not Found">
        <p className="border border-black/10 bg-white p-6">This category no longer exists.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Edit ${category.name}`}>
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Category saved. Publish from the dashboard to make it live.
        </p>
      )}
      <CategoryEditor category={category} />
      <form action={deleteCategoryAction} className="mt-10 border border-red-200 bg-red-50 p-6">
        <input type="hidden" name="id" value={category.id} />
        <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Deleting a category will also delete all its products (cascade).
        </p>
        <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800">
          Delete Category
        </button>
      </form>
    </AdminShell>
  );
}
