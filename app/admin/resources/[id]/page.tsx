import AdminShell from "@/components/admin/AdminShell";
import BlogEditorClient from "@/components/admin/BlogEditorClient";
import { requireAdmin } from "@/lib/auth";
import { getBlogEditorData } from "@/lib/admin-cms";
import { deleteBlogPostAction } from "@/app/admin/actions";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const { categories, mediaAssets, post } = await getBlogEditorData(id);

  if (!post) {
    return (
      <AdminShell title="Article Not Found">
        <p className="border border-black/10 bg-white p-6">This article no longer exists.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Edit: ${post.title}`}>
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Draft saved. Publish from the dashboard to make it live.
        </p>
      )}
      <BlogEditorClient post={post} categories={categories} mediaAssets={mediaAssets} />
      <form action={deleteBlogPostAction} className="mt-10 border border-red-200 bg-red-50 p-6">
        <input type="hidden" name="id" value={post.id} />
        <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">This will permanently delete the article.</p>
        <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800 hover:bg-red-700 hover:text-white transition">
          Delete Article
        </button>
      </form>
    </AdminShell>
  );
}
