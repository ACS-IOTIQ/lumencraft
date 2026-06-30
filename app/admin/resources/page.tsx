import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminBlogPosts } from "@/lib/admin-cms";

export default async function AdminResourcesPage() {
  await requireAdmin();
  const posts = await getAdminBlogPosts();

  return (
    <AdminShell title="Resources">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/resources/categories" className="border border-black/20 px-4 py-2.5 text-sm font-medium hover:border-black">
          Manage Categories
        </Link>
        <Link href="/admin/resources/new" className="bg-black px-5 py-3 text-sm font-semibold text-white">
          New Article
        </Link>
      </div>

      <div className="overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#f5f5f3] text-left text-[11px] uppercase tracking-[0.12em] text-black/50">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Author</th>
              <th className="px-5 py-4">Read time</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/40">
                  No articles yet.{" "}
                  <Link href="/admin/resources/new" className="underline hover:text-black">
                    Create your first article
                  </Link>
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-black/10">
                <td className="px-5 py-4 font-medium">
                  {post.title}
                  {post.isFeatured && (
                    <span className="ml-2 rounded-sm bg-black px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-black/60">{post.category?.name ?? "—"}</td>
                <td className="px-5 py-4 text-black/60">{post.author}</td>
                <td className="px-5 py-4 text-black/60">{post.readingTime} min</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
                    post.isActive ? "bg-green-50 text-green-700" : "bg-[#f5f5f3] text-black/50"
                  }`}>
                    {post.isActive ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/resources/${post.id}`} className="font-semibold hover:text-black/60">
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
