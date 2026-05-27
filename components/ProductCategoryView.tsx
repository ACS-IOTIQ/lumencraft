"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductIcon from "@/components/ProductIcon";
import type { CmsCategory } from "@/lib/cms-types";

export default function ProductCategoryView({ category }: { category: CmsCategory }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = [
    { label: "All", value: "all" },
    { label: "< 15W", value: "lt15" },
    { label: "15 - 30W", value: "15-30" },
    { label: "30 - 60W", value: "30-60" },
    { label: "60W+", value: "gt60" },
  ];

  const filteredProducts = category.products.filter((product) => {
    if (activeFilter === "all") return true;
    const text = `${product.shortDescription ?? ""} ${product.keyDetails.map((detail) => detail.value).join(" ")}`;
    if (activeFilter === "lt15") return /(^|\D)([1-9]|1[0-4])W/i.test(text);
    if (activeFilter === "15-30") return /(15|18|24|28|30)W/i.test(text);
    if (activeFilter === "30-60") return /(36|40|48|50|60)W/i.test(text);
    return /(72|80|90|100|120|150|200|300)W/i.test(text);
  });

  return (
    <>
      <header className="px-6 pt-14 pb-10 bg-white sm:px-10 lg:px-20">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#888884] mb-3">
          Category
        </p>
        <h1 className="text-5xl font-medium tracking-tight leading-tight mb-5">{category.name}</h1>
        <p className="text-base font-light text-[#888884] leading-relaxed max-w-[720px]">
          {category.description}
        </p>
      </header>

      <div className="flex items-center justify-between px-6 py-4 bg-[#f5f5f3] border-t border-b border-[#e8e8e5] flex-wrap gap-4 sm:px-10 lg:px-20">
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {filters.map((filter) => (
            <li key={filter.value}>
              <button
                onClick={() => setActiveFilter(filter.value)}
                className={`px-0 py-1.5 text-sm tracking-wide border-b-[1.5px] transition-all ${
                  activeFilter === filter.value
                    ? "text-black border-black font-medium"
                    : "text-[#888884] border-transparent hover:text-black"
                }`}
              >
                {filter.label}
              </button>
            </li>
          ))}
        </ul>
        <span className="text-sm text-[#888884]">{filteredProducts.length} products</span>
      </div>

      <section className="px-6 pt-14 pb-20 bg-white sm:px-10 lg:px-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="flex flex-col items-center group relative"
            >
              <div className="w-full aspect-square flex items-center justify-center mb-4 overflow-hidden">
                <ProductIcon type={category.icon} className="w-4/5 h-4/5 transition-transform duration-400 group-hover:scale-105" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium tracking-wider uppercase text-[#888884] mb-1.5">
                  {product.family ?? product.categoryName}
                </p>
                <h3 className="text-base font-normal tracking-tight text-black mb-1 transition-colors group-hover:text-[#3b6ff0]">
                  {product.name}
                </h3>
                <p className="text-xs text-[#888884]">{product.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f3] px-6 py-24 sm:px-10 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          <div className="aspect-[4/3] bg-[#1a1a1a] rounded-sm overflow-hidden">
            <Image
              src={category.products[0]?.images[1] ?? "/lumencraft/project-skywalk.jpg"}
              alt={`${category.name} in use`}
              width={900}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-[32px] font-medium tracking-tight mb-6">
              Built for Architectural Projects
            </h2>
            <p className="text-[15px] font-light text-[#3a3a38] leading-relaxed mb-5">
              {category.description} Every fixture in this range is selected for dependable field performance,
              clear specification, and control-ready commissioning.
            </p>
            <p className="text-[15px] font-light text-[#3a3a38] leading-relaxed">
              Publish updated products, models, downloads, and technical data from the admin panel whenever the
              catalogue changes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
