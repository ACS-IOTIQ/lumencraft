import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedSite, getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/cms-data";
import type { Metadata } from "next";
import BlogContent from "@/components/BlogContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: "Article Not Found | Lumencraft" };

  return {
    title: post.seoTitle ?? `${post.title} | Lumencraft`,
    description: post.seoDescription ?? post.excerpt,
    openGraph: post.seoImage ? { images: [post.seoImage] } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, post, allPosts] = await Promise.all([
    getPublishedSite(),
    getPublishedBlogPost(slug),
    getPublishedBlogPosts(),
  ]);

  if (!post) notFound();

  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.categoryId === post.categoryId ||
          p.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3);

  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      {/* Breadcrumb */}
      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link href="/resources" className="hover:text-black transition-colors">Resources</Link>
          {post.categoryName && (
            <>
              <span className="text-[#e8e8e5]">/</span>
              <Link href={`/resources?category=${post.categorySlug}`} className="hover:text-black transition-colors">
                {post.categoryName}
              </Link>
            </>
          )}
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black line-clamp-1">{post.title}</span>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-[760px] px-6 py-14 sm:px-10 lg:py-20">
        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
          {post.categoryName && (
            <>
              <Link href={`/resources?category=${post.categorySlug}`} className="hover:text-black transition-colors">
                {post.categoryName}
              </Link>
              <span className="opacity-40">·</span>
            </>
          )}
          <span>{post.readingTime} min read</span>
        </div>

        <h1 className="mb-6 text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[44px] lg:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mb-8 text-[17px] font-light leading-[1.75] text-[#3a3a38]">
            {post.excerpt}
          </p>
        )}

        {/* Author + date */}
        <div className="mb-10 flex items-center gap-4 border-b border-[#e8e8e5] pb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f3] text-sm font-semibold text-black">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-black">{post.author}</p>
            <p className="text-xs text-[#888884]">{date}</p>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-sm border border-[#e8e8e5]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 760px) 100vw, 760px"
              priority
            />
          </div>
        )}

        {/* Rich text content */}
        <BlogContent content={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-[#e8e8e5] pt-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/resources?tag=${encodeURIComponent(tag)}`}
                className="rounded-sm border border-[#e8e8e5] px-3 py-1.5 text-xs font-medium text-black/60 transition hover:border-black hover:text-black"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[#e8e8e5] bg-[#f5f5f3] px-6 py-14 sm:px-10 lg:px-20">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">Continue reading</p>
          <h2 className="mb-8 text-[28px] font-medium tracking-[-0.025em] text-black">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/resources/${related.slug}`}
                className="group flex flex-col overflow-hidden rounded-sm border border-[#e8e8e5] bg-white transition hover:border-black hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0ee]">
                  {related.coverImage ? (
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-10 w-10 text-[#d0d0cc]" fill="none" viewBox="0 0 40 40" stroke="currentColor">
                        <rect x="4" y="4" width="32" height="32" rx="2" strokeWidth="1.5" />
                        <path d="M4 28l9-9 6 6 6-7 9 10" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {related.categoryName && (
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                      {related.categoryName}
                    </p>
                  )}
                  <h3 className="flex-1 text-sm font-medium leading-snug text-black group-hover:text-black/70 transition">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#888884]">{related.readingTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
