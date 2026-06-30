import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getContactPageEditorData } from "@/lib/admin-cms";
import { saveContactPageAction } from "@/app/admin/actions";

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const contact = await getContactPageEditorData();

  const detailsJson = JSON.stringify(contact.details, null, 2);

  return (
    <AdminShell title="Contact Page">
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Contact page saved. Publish from the dashboard to make it live.
        </p>
      )}

      <form action={saveContactPageAction} className="grid gap-6 max-w-3xl">
        {/* Hero */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Hero</h2>
          <label className="grid gap-2 text-sm font-medium">
            Intro paragraph
            <textarea
              name="heroCopy"
              defaultValue={contact.heroCopy}
              rows={3}
              className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
            />
          </label>
        </section>

        {/* Contact details */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-1 text-xl font-semibold">Contact Details</h2>
          <p className="mb-4 text-sm text-black/50">
            JSON array of blocks. Each block:{" "}
            <code className="bg-black/5 px-1 font-mono">
              {"{ \"label\": \"Call us on\", \"items\": [{ \"text\": \"+91 …\", \"href\": \"tel:…\" }] }"}
            </code>
            . Use <code className="bg-black/5 px-1 font-mono">null</code> for{" "}
            <code className="bg-black/5 px-1 font-mono">href</code> on plain text lines (e.g. address).
          </p>
          <textarea
            name="details"
            defaultValue={detailsJson}
            rows={22}
            className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
          />
        </section>

        {/* Form section */}
        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Enquiry Form</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Form heading
              <input
                name="formHeading"
                defaultValue={contact.formHeading}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Form subtext
              <input
                name="formSubtext"
                defaultValue={contact.formSubtext}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Link href="/contact" target="_blank" className="text-sm font-medium text-black/50 hover:text-black">
            Preview page →
          </Link>
          <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Save Contact Page
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
