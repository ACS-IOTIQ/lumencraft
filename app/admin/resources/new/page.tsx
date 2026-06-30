import AdminShell from "@/components/admin/AdminShell";
import BlogEditorClient from "@/components/admin/BlogEditorClient";
import { requireAdmin } from "@/lib/auth";
import { getBlogEditorData } from "@/lib/admin-cms";

export default async function NewBlogPostPage() {
  await requireAdmin();
  const { categories, mediaAssets } = await getBlogEditorData();

  return (
    <AdminShell title="New Article">
      <BlogEditorClient post={null} categories={categories} mediaAssets={mediaAssets} />
    </AdminShell>
  );
}
