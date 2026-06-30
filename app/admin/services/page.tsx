import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getServicesEditorData } from "@/lib/admin-cms";
import { saveServicesPageAction } from "@/app/admin/actions";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const services = await getServicesEditorData();

  const servicesJson = JSON.stringify(services.services, null, 2);
  const processJson = JSON.stringify(services.process, null, 2);
  const whyJson = JSON.stringify(services.whyItems, null, 2);

  return (
    <AdminShell title="Services Page">
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Services page saved. Publish from the dashboard to make it live.
        </p>
      )}

      <form action={saveServicesPageAction} className="grid gap-6 max-w-3xl">
        {/* Hero */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Hero</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Headline
              <input
                name="heroHeadline"
                defaultValue={services.heroHeadline}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Copy paragraph
              <textarea
                name="heroCopy"
                defaultValue={services.heroCopy}
                rows={3}
                className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        {/* Services grid */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Services Grid (6 tiles)</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array — each item: <code className="font-mono bg-black/5 px-1">{"{ \"number\": \"01\", \"title\", \"description\" }"}</code>. Icons are fixed by position.
          </p>
          <textarea
            name="services"
            defaultValue={servicesJson}
            rows={24}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* Process */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Process Steps (4 steps)</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array — each item: <code className="font-mono bg-black/5 px-1">{"{ \"step\": \"01\", \"title\", \"description\" }"}</code>
          </p>
          <textarea
            name="process"
            defaultValue={processJson}
            rows={16}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* Why Lumencraft */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Why Lumencraft (3 items)</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array — each item: <code className="font-mono bg-black/5 px-1">{"{ \"label\", \"description\" }"}</code>
          </p>
          <textarea
            name="whyItems"
            defaultValue={whyJson}
            rows={12}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* CTA */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">CTA Banner</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Headline
              <input
                name="ctaHeadline"
                defaultValue={services.ctaHeadline}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Body text
              <textarea
                name="ctaBody"
                defaultValue={services.ctaBody}
                rows={2}
                className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Link href="/services" target="_blank" className="text-sm font-medium text-black/50 hover:text-black">
            Preview page →
          </Link>
          <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Save Services Page
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
