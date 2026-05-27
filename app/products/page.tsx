import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProductIcon from "@/components/ProductIcon";
import { getPublishedSite } from "@/lib/cms-data";

export default async function ProductsPage() {
  const site = await getPublishedSite();

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      <div className="sticky top-16 z-40 px-6 py-3 bg-white border-b border-[#e8e8e5] sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">Products</span>
        </div>
      </div>

      <header className="px-6 pt-14 pb-10 bg-white sm:px-10 lg:px-20">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#888884] mb-3">
          Catalogue
        </p>
        <h1 className="text-5xl font-medium tracking-tight leading-tight mb-5">Products</h1>
        <p className="text-base font-light text-[#888884] leading-relaxed max-w-[720px]">
          A complete range of architectural and facade lighting fixtures, engineered for landmark applications.
          From pixel-addressable LED arrays to high-output flood projectors and DMX control systems - every product
          is built for demanding outdoor environments and 24/7 operation.
        </p>
      </header>

      <section className="px-6 pt-6 pb-24 bg-white sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {site.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-square flex items-center justify-center mb-5 overflow-hidden">
                <ProductIcon type={category.icon} className="w-4/5 h-4/5 transition-transform duration-400 group-hover:scale-105" />
              </div>
              <div className="text-center">
                <h3 className="text-[17px] font-normal tracking-tight text-black transition-colors group-hover:text-[#3b6ff0]">
                  {category.name}
                </h3>
                <p className="text-xs text-[#888884] mt-1">{category.products.length} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
