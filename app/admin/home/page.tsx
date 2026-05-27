import AdminShell from "@/components/admin/AdminShell";
import { saveHomeAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getHomeEditorData } from "@/lib/admin-cms";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const data = await getHomeEditorData();

  const heroSlides = data.heroSlides.map((slide) => ({
    title: slide.title,
    eyebrow: slide.eyebrow,
    copy: slide.copy,
    image: slide.imageUrl,
    align: slide.align,
    isActive: slide.isActive,
  }));
  const featuredProjects = data.featuredProjects.map((project) => ({
    name: project.name,
    location: project.location,
    image: project.imageUrl,
    isActive: project.isActive,
  }));
  const partners = data.partners.map((partner) => ({
    name: partner.name,
    image: partner.imageUrl,
    isActive: partner.isActive,
  }));

  return (
    <AdminShell title="Homepage">
      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Homepage draft saved.
        </p>
      )}
      <form action={saveHomeAction} className="grid gap-6">
        <AdminJson name="heroSlides" title="Hero Slides" value={pretty(heroSlides)} />
        <AdminJson name="featuredProjects" title="Featured Projects" value={pretty(featuredProjects)} />
        <AdminJson name="partners" title="Technology Partners" value={pretty(partners)} />
        <AdminJson name="contact" title="Contact Section" value={pretty(data.contact)} />
        <div className="sticky bottom-4 flex justify-end">
          <button className="rounded-sm bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl">
            Save Homepage Draft
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function AdminJson({ name, title, value }: { name: string; title: string; value: string }) {
  return (
    <section className="border border-black/10 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <textarea name={name} defaultValue={value} rows={14} className="w-full border border-black/15 p-4 font-mono text-xs" />
    </section>
  );
}
