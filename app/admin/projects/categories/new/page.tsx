import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { saveProjectCategoryAction } from "@/app/admin/actions";

export default async function NewProjectCategoryPage() {
  await requireAdmin();

  return (
    <AdminShell title="New Project Category">
      <Link
        href="/admin/projects/categories"
        className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black"
      >
        ← All categories
      </Link>

      <form action={saveProjectCategoryAction} className="grid gap-6 max-w-2xl">
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Category Details</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Name <span className="text-red-500">*</span>
              <input
                name="name"
                required
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Slug <span className="text-red-500">*</span>
              <input
                name="slug"
                required
                pattern="[a-z0-9-]+"
                className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40"
                placeholder="e.g. commercial"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Sort order
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input name="isActive" type="checkbox" defaultChecked />
              Active (visible in filters)
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Create Category
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
