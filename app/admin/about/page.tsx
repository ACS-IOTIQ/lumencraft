import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAboutEditorData } from "@/lib/admin-cms";
import { saveAboutPageAction } from "@/app/admin/actions";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const about = await getAboutEditorData();

  const statsJson = JSON.stringify(about.stats, null, 2);
  const capabilitiesJson = JSON.stringify(about.capabilities, null, 2);

  return (
    <AdminShell title="About Page">
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          About page saved. Publish from the dashboard to make it live.
        </p>
      )}

      <form action={saveAboutPageAction} className="grid gap-6 max-w-3xl">
        {/* Brand Statement */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Brand Statement</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Quote
              <input
                name="brandQuote"
                defaultValue={about.brandQuote}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Subtext (below quote)
              <input
                name="brandSubtext"
                defaultValue={about.brandSubtext}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        {/* Company Overview */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Company Overview</h2>
          <p className="mb-5 text-sm text-black/50">Separate paragraphs with a blank line.</p>
          <textarea
            name="overviewParagraphs"
            defaultValue={about.overviewParagraphs.join("\n\n")}
            rows={10}
            className="w-full border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
          />
        </section>

        {/* Stats */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Stats Bar</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array — each item: <code className="font-mono bg-black/5 px-1">{"{ \"value\": \"12+\", \"label\": \"Years\" }"}</code>
          </p>
          <textarea
            name="stats"
            defaultValue={statsJson}
            rows={10}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* Capabilities */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Capabilities (3 cards)</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array — each item: <code className="font-mono bg-black/5 px-1">{"{ \"title\", \"description\", \"link\", \"linkLabel\" }"}</code>. Icons are fixed by position.
          </p>
          <textarea
            name="capabilities"
            defaultValue={capabilitiesJson}
            rows={16}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* Vision */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Vision Statement</h2>
          <textarea
            name="visionStatement"
            defaultValue={about.visionStatement}
            rows={3}
            className="w-full border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
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
                defaultValue={about.ctaHeadline}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Body text
              <textarea
                name="ctaBody"
                defaultValue={about.ctaBody}
                rows={2}
                className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Link href="/about" target="_blank" className="text-sm font-medium text-black/50 hover:text-black">
            Preview page →
          </Link>
          <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Save About Page
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
