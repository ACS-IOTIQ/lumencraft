import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { saveBlogCategoryAction } from "@/app/admin/actions";
import Link from "next/link";

export default async function NewBlogCategoryPage() {
  await requireAdmin();

  return (
    <AdminShell title="New Resource Category">
      <Link href="/admin/resources/categories" className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black">
        ← All categories
      </Link>
      <BlogCategoryForm />
    </AdminShell>
  );
}

function BlogCategoryForm({ category }: { category?: { id: string; name: string; slug: string; description: string | null; sortOrder: number; isActive: boolean } }) {
  return (
    <form action={saveBlogCategoryAction} className="grid gap-6 max-w-2xl">
      {category && <input type="hidden" name="id" value={category.id} />}

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Category Details</h2>
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-black">
            Name
            <input name="name" defaultValue={category?.name ?? ""} required className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black">
            Slug
            <input name="slug" defaultValue={category?.slug ?? ""} required className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40" placeholder="e.g. lighting-design" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black">
            Description
            <textarea name="description" defaultValue={category?.description ?? ""} rows={2} className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black">
            Sort order
            <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} />
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
  );
}
