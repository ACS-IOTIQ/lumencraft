import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getPublishedSite, getPublishedBlogPosts, getPublishedBlogCategories } from "@/lib/cms-data";
import type { CmsBlogPost } from "@/lib/cms-types";

export const metadata = {
  title: "Resources | Lumencraft",
  description: "Expert insights, design guides, and technical articles on DMX architectural lighting.",
};

function PostCard({ post }: { post: CmsBlogPost }) {
  return (
    <Link href={`/resources/${post.slug}`} className="group flex flex-col overflow-hidden rounded-sm border border-[#e8e8e5] bg-white transition hover:border-black hover:-translate-y-0.5">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f5f5f3]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-[#d0d0cc]" fill="none" viewBox="0 0 64 64" stroke="currentColor">
              <rect x="8" y="8" width="48" height="48" rx="2" strokeWidth="1.5" />
              <path d="M8 44l14-14 10 10 10-12 14 16" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="22" cy="24" r="4" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.categoryName && (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
            {post.categoryName}
          </p>
        )}
        <h2 className="mb-3 text-lg font-medium leading-snug tracking-[-0.02em] text-black group-hover:text-black/70 transition">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 flex-1 text-sm font-light leading-[1.7] text-[#3a3a38] line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#e8e8e5] pt-4 text-xs text-[#888884]">
          <span>{post.author}</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [site, allPosts, blogCategories] = await Promise.all([
    getPublishedSite(),
    getPublishedBlogPosts(),
    getPublishedBlogCategories(),
  ]);

  const featuredPost = allPosts.find((p) => p.isFeatured) ?? allPosts[0];

  let posts = allPosts;
  if (params.category) {
    posts = posts.filter((p) => p.categorySlug === params.category);
  }
  if (params.tag) {
    posts = posts.filter((p) => p.tags.includes(params.tag!));
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q),
    );
  }

  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      {/* Hero */}
      <section className="border-b border-[#e8e8e5] bg-[#f5f5f3] px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Knowledge Hub</p>
        <h1 className="mb-4 text-[42px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-5xl lg:text-[56px]">
          Resources
        </h1>
        <p className="max-w-[560px] text-[15px] font-light leading-[1.75] text-[#3a3a38]">
          Expert insights, design guides, and technical articles on DMX architectural lighting, installation practices, and lighting design.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && !params.category && !params.tag && !params.q && (
        <section className="border-b border-[#e8e8e5] px-6 py-14 sm:px-10 lg:px-20">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Featured</p>
          <Link
            href={`/resources/${featuredPost.slug}`}
            className="group grid items-center gap-8 rounded-sm border border-[#e8e8e5] bg-white p-6 transition hover:border-black sm:p-8 lg:grid-cols-[1fr_1.5fr]"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-[#f5f5f3]">
              {featuredPost.coverImage ? (
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-20 w-20 text-[#d0d0cc]" fill="none" viewBox="0 0 64 64" stroke="currentColor">
                    <rect x="8" y="8" width="48" height="48" rx="2" strokeWidth="1.5" />
                    <path d="M8 44l14-14 10 10 10-12 14 16" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              {featuredPost.categoryName && (
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  {featuredPost.categoryName}
                </p>
              )}
              <h2 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-black group-hover:text-black/70 transition sm:text-3xl">
                {featuredPost.title}
              </h2>
              {featuredPost.excerpt && (
                <p className="mb-6 text-[15px] font-light leading-[1.75] text-[#3a3a38]">
                  {featuredPost.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-[#888884]">
                <span>{featuredPost.author}</span>
                <span>·</span>
                <span>{featuredPost.readingTime} min read</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="px-6 py-14 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Main content */}
          <div className="flex-1">
            {/* Search */}
            <form method="get" className="mb-8">
              <div className="flex gap-2">
                <input
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Search articles…"
                  className="flex-1 border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/40"
                />
                <button
                  type="submit"
                  className="border border-black px-5 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  Search
                </button>
              </div>
            </form>

            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[15px] text-[#888884]">No articles found.</p>
                <Link href="/resources" className="mt-3 inline-block text-sm font-medium underline hover:text-black/60">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            {/* Categories */}
            {blogCategories.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Categories</h3>
                <div className="grid gap-1">
                  <Link
                    href="/resources"
                    className={`px-3 py-2.5 text-sm transition rounded-sm ${
                      !params.category ? "bg-black text-white" : "text-black/70 hover:bg-black/5 hover:text-black"
                    }`}
                  >
                    All Articles
                    <span className="ml-2 text-xs opacity-60">({allPosts.length})</span>
                  </Link>
                  {blogCategories.map((cat) => {
                    const count = allPosts.filter((p) => p.categorySlug === cat.slug).length;
                    return (
                      <Link
                        key={cat.id}
                        href={`/resources?category=${cat.slug}`}
                        className={`px-3 py-2.5 text-sm transition rounded-sm ${
                          params.category === cat.slug
                            ? "bg-black text-white"
                            : "text-black/70 hover:bg-black/5 hover:text-black"
                        }`}
                      >
                        {cat.name}
                        <span className="ml-2 text-xs opacity-60">({count})</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/resources?tag=${encodeURIComponent(tag)}`}
                      className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition ${
                        params.tag === tag
                          ? "border-black bg-black text-white"
                          : "border-[#e8e8e5] text-black/60 hover:border-black hover:text-black"
                      }`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
