import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProductDetailView from "@/components/ProductDetailView";
import { getPublishedProduct, getPublishedSite } from "@/lib/cms-data";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getPublishedSite();
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      <div className="sticky top-16 z-40 px-6 py-3 bg-white border-b border-[#e8e8e5] sm:px-10 lg:px-20">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <span className="text-[#e8e8e5]">/</span>
          <Link href={product.categoryHref} className="hover:text-black transition-colors">
            {product.categoryName}
          </Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>

      <ProductDetailView product={product} />
      <Footer />
    </div>
  );
}
