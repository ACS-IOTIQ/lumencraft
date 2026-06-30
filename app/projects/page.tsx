import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPublishedSite, getPublishedProjects, getPublishedProjectCategories } from "@/lib/cms-data";
import ProjectsGrid from "./_components/ProjectsGrid";

export const metadata = {
  title: "Projects | Lumencraft",
  description:
    "A portfolio of architectural lighting projects — bridges, facades, hotels, cultural spaces and more across India.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [site, allProjects, projectCategories] = await Promise.all([
    getPublishedSite(),
    getPublishedProjects(),
    getPublishedProjectCategories(),
  ]);

  const filtered = params.category
    ? allProjects.filter((p) => p.categorySlug === params.category)
    : allProjects;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">Projects</span>
        </div>
      </div>

      <header className="border-b border-[#e8e8e5] bg-[#f5f5f3] px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Portfolio</p>
        <h1 className="mb-4 text-5xl font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[52px]">
          Our Projects
        </h1>
        <p className="max-w-[580px] text-[15px] font-light leading-[1.75] text-[#3a3a38]">
          From landmark bridges to cultural facades — a selection of architectural lighting projects
          delivered across India.
        </p>
      </header>

      <div className="px-6 py-12 sm:px-10 lg:px-20">
        {projectCategories.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <Link
              href="/projects"
              className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
                !params.category
                  ? "border-black bg-black text-white"
                  : "border-[#e8e8e5] text-black/70 hover:border-black hover:text-black"
              }`}
            >
              All
              <span className="ml-2 text-xs opacity-60">({allProjects.length})</span>
            </Link>
            {projectCategories.map((cat) => {
              const count = allProjects.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.id}
                  href={`/projects?category=${cat.slug}`}
                  className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${
                    params.category === cat.slug
                      ? "border-black bg-black text-white"
                      : "border-[#e8e8e5] text-black/70 hover:border-black hover:text-black"
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 text-xs opacity-60">({count})</span>
                </Link>
              );
            })}
          </div>
        )}

        <ProjectsGrid projects={filtered} />
      </div>

      <section className="border-t border-[#e8e8e5] bg-black px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Let&apos;s talk about your project
            </h2>
            <p className="mt-2 text-sm font-light text-white/60">
              Get in touch to explore how our lighting solutions can bring your project to life.
            </p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
