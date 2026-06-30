import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedSite, getPublishedProject, getPublishedProjects } from "@/lib/cms-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project Not Found | Lumencraft" };

  return {
    title: `${project.name} | Lumencraft Projects`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, project, allProjects] = await Promise.all([
    getPublishedSite(),
    getPublishedProject(slug),
    getPublishedProjects(),
  ]);

  if (!project) notFound();

  const related = allProjects
    .filter((p) => p.id !== project.id && p.categorySlug === project.categorySlug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link href="/projects" className="transition-colors hover:text-black">Projects</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link
            href={`/projects?category=${project.categorySlug}`}
            className="transition-colors hover:text-black"
          >
            {project.categoryName}
          </Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="line-clamp-1 text-black">{project.name}</span>
        </div>
      </div>

      <header className="px-6 pt-12 pb-8 sm:px-10 lg:px-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
          {project.categoryName}
        </p>
        <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-5xl">
          {project.name}
        </h1>
      </header>

      <section className="px-6 pb-14 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_256px]">

          {/* Left: Metadata + Products Used */}
          <div>
            <dl className="space-y-5 border-t border-[#e8e8e5] pt-6">
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  Location
                </dt>
                <dd className="text-sm font-medium text-black">{project.location}</dd>
              </div>
              {project.designer && (
                <div>
                  <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                    Designer
                  </dt>
                  <dd className="text-sm font-medium text-black">{project.designer}</dd>
                </div>
              )}
              {project.completionYear && (
                <div>
                  <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                    Year
                  </dt>
                  <dd className="text-sm font-medium text-black">{project.completionYear}</dd>
                </div>
              )}
              <div>
                <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  Sector
                </dt>
                <dd className="text-sm font-medium text-black">{project.categoryName}</dd>
              </div>
            </dl>

            {project.productsUsed.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  Products Used
                </p>
                <div className="flex flex-col gap-2">
                  {project.productsUsed.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="group flex items-center justify-between border border-[#e8e8e5] px-4 py-3 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
                    >
                      {product.name}
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center: Main Image */}
          <div className="relative min-h-[300px] overflow-hidden bg-neutral-100 lg:min-h-0">
            <Image
              src={project.featuredImage}
              alt={project.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, calc(100vw - 580px)"
            />
          </div>

          {/* Right: Gallery */}
          {project.galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
              {project.galleryImages.slice(0, 2).map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={img}
                    alt={`${project.name} — view ${i + 2}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 256px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {project.description && (
        <section className="border-t border-[#e8e8e5] bg-[#f5f5f3] px-6 py-14 sm:px-10 lg:px-20">
          <div className="max-w-[760px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
              About the Project
            </p>
            {project.description.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 text-[15px] font-light leading-[1.8] text-[#3a3a38]">
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-[#e8e8e5] px-6 py-14 sm:px-10 lg:px-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-black">
              More {project.categoryName} Projects
            </h2>
            <Link
              href={`/projects?category=${project.categorySlug}`}
              className="shrink-0 text-sm text-[#888884] transition-colors hover:text-black"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rel) => (
              <Link key={rel.id} href={`/projects/${rel.slug}`} className="group flex flex-col">
                <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
                  <Image
                    src={rel.featuredImage}
                    alt={rel.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-black">
                    {rel.name}
                  </h3>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-black/58">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
                        d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M12 10.5h.01" />
                    </svg>
                    {rel.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-black px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Let&apos;s talk about your project
            </h2>
            <p className="mt-2 text-sm font-light text-white/60">
              Get in touch to explore how our lighting solutions can bring your vision to life.
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
