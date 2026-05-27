import AdminShell from "@/components/admin/AdminShell";
import { deleteMediaAction, uploadMediaAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Media Library">
      {params.uploaded && <Notice tone="green">File uploaded.</Notice>}
      {params.deleted && <Notice tone="green">File deleted.</Notice>}
      {params.error === "in-use" && <Notice tone="red">This file is used by content and cannot be deleted.</Notice>}
      {params.error === "file" && <Notice tone="red">Choose a file before uploading.</Notice>}

      <form action={uploadMediaAction} className="mb-8 border border-black/10 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Upload Asset</h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Image, PDF, IES, or logo
            <input name="file" type="file" className="border border-black/15 px-3 py-3" required />
          </label>
          <button className="bg-black px-6 py-3 text-sm font-semibold text-white">Upload</button>
        </div>
      </form>

      <div className="grid gap-4">
        {assets.map((asset) => (
          <article key={asset.id} className="grid gap-4 border border-black/10 bg-white p-5 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-semibold">{asset.filename}</h3>
              <p className="mt-1 text-sm text-black/55">
                {asset.kind} / {asset.contentType} / {(asset.size / 1024).toFixed(1)} KB
              </p>
              <p className="mt-1 break-all font-mono text-xs text-black/45">{asset.key}</p>
            </div>
            <form action={deleteMediaAction}>
              <input type="hidden" name="id" value={asset.id} />
              <button className="border border-black/15 px-4 py-2 text-sm font-semibold">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "green" | "red" }) {
  return (
    <p
      className={`mb-6 border px-4 py-3 text-sm ${
        tone === "green" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </p>
  );
}
