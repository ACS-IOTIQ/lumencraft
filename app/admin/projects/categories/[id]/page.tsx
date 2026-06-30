import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { saveProjectCategoryAction, deleteProjectCategoryAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function EditProjectCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;

  const category = await prisma.projectCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <AdminShell title={`Edit: ${category.name}`}>
      <Link
        href="/admin/projects/categories"
        className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black"
      >
        ← All categories
      </Link>

      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Category saved successfully.
        </p>
      )}

      <form action={saveProjectCategoryAction} className="grid gap-6 max-w-2xl">
        <input type="hidden" name="id" value={category.id} />

        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Category Details</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Name <span className="text-red-500">*</span>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Slug <span className="text-red-500">*</span>
              <input
                name="slug"
                defaultValue={category.slug}
                required
                pattern="[a-z0-9-]+"
                className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Sort order
              <input
                name="sortOrder"
                type="number"
                defaultValue={category.sortOrder}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input name="isActive" type="checkbox" defaultChecked={category.isActive} />
              Active (visible in filters)
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Save Category
          </button>
        </div>
      </form>

      <form action={deleteProjectCategoryAction} className="mt-10 max-w-2xl border border-red-200 bg-red-50 p-6">
        <input type="hidden" name="id" value={category.id} />
        <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Deleting this category will also delete all projects assigned to it.
        </p>
        <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-700 hover:text-white">
          Delete Category
        </button>
      </form>
    </AdminShell>
  );
}
