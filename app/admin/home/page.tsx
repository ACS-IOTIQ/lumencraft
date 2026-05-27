import AdminShell from "@/components/admin/AdminShell";
import HomeEditor from "@/components/admin/HomeEditor";
import { requireAdmin } from "@/lib/auth";
import { getHomeEditorData } from "@/lib/admin-cms";

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
      <HomeEditor
        heroSlides={heroSlides}
        featuredProjects={featuredProjects}
        partners={partners}
        contact={data.contact}
      />
    </AdminShell>
  );
}
