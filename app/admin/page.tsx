import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { initializeDraftsAction, publishSiteAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrFallbackDashboard } from "@/lib/admin-cms";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; initialized?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const { data, error } = await getAdminOrFallbackDashboard();

  return (
    <AdminShell title="Dashboard">
      {params.published && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Published content is now live.
        </p>
      )}
      {params.initialized && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Draft content initialized.
        </p>
      )}
      {error && (
        <section className="border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="text-xl font-semibold">Setup required</h2>
          <p className="mt-2 text-sm">{error}</p>
          <p className="mt-4 text-sm">
            Start Docker services, copy `.env.example` to `.env`, then run Prisma migrations.
          </p>
        </section>
      )}
      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["Products", data.productCount],
              ["Categories", data.categoryCount],
              ["Files", data.mediaCount],
              ["Hero Slides", data.heroCount],
              ["Projects", data.projectCount],
              ["Partners", data.partnerCount],
            ].map(([label, value]) => (
              <div key={label} className="border border-black/10 bg-white p-5">
                <p className="text-sm text-black/50">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="border border-black/10 bg-white p-6">
              <h2 className="text-xl font-semibold">Publishing</h2>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Public pages read the last published snapshot. Draft changes stay private until you publish.
              </p>
              <dl className="mt-6 grid gap-4 text-sm">
                <div className="flex justify-between border-b border-black/10 pb-3">
                  <dt>Last published</dt>
                  <dd>{data.publishedAt ? data.publishedAt.toLocaleString() : "Never"}</dd>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-3">
                  <dt>Unpublished changes</dt>
                  <dd>{data.hasUnpublishedChanges ? "Yes" : "No"}</dd>
                </div>
              </dl>
              <form action={publishSiteAction} className="mt-6">
                <button className="bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80">
                  Publish Website
                </button>
              </form>
            </div>

            <div className="grid gap-3">
              <Link href="/admin/products/new" className="border border-black bg-black px-5 py-4 text-sm font-semibold text-white">
                Add Product
              </Link>
              <Link href="/admin/media" className="border border-black bg-white px-5 py-4 text-sm font-semibold">
                Upload File
              </Link>
              <Link href="/admin/home" className="border border-black bg-white px-5 py-4 text-sm font-semibold">
                Edit Homepage
              </Link>
              <form action={initializeDraftsAction}>
                <button className="w-full border border-black/15 bg-white px-5 py-4 text-left text-sm font-semibold">
                  Initialize Draft Content
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </AdminShell>
  );
}
