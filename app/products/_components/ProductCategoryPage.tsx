import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCategoryView from "@/components/ProductCategoryView";
import Link from "next/link";
import { getPublishedCategory, getPublishedSite } from "@/lib/cms-data";
import { notFound } from "next/navigation";

export default async function ProductCategoryPage({ slug }: { slug: string }) {
  const site = await getPublishedSite();
  const category = await getPublishedCategory(slug);
  if (!category) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />
      <div className="sticky top-16 z-40 px-6 py-3 bg-white border-b border-[#e8e8e5] sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">{category.name}</span>
        </div>
      </div>
      <ProductCategoryView category={category} />
      <Footer />
    </div>
  );
}
