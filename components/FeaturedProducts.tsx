"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CmsProduct } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

function chunkProducts(products: CmsProduct[]) {
  const pages: CmsProduct[][] = [];
  for (let index = 0; index < products.length; index += 4) {
    pages.push(products.slice(index, index + 4));
  }
  return pages.length ? pages : [fallbackSiteContent.featuredProducts.slice(0, 4)];
}

export default function FeaturedProducts({
  products = fallbackSiteContent.featuredProducts,
}: {
  products?: CmsProduct[];
}) {
  const productPages = chunkProducts(products);
  const [currentPage, setCurrentPage] = useState(0);

  const nextSlide = () => {
    setCurrentPage((page) => (page + 1) % productPages.length);
  };

  const prevSlide = () => {
    setCurrentPage((page) => (page - 1 + productPages.length) % productPages.length);
  };

  return (
    <section id="products" className="bg-[#f3f3f3] py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <div className="mb-12 flex items-center justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-normal text-black sm:text-4xl">
            Featured Products
          </h2>
          <div className="flex gap-3" aria-label="Product carousel controls">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Previous products"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 19-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Next products"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {productPages.map((page) => (
              <div
                key={page.map((product) => product.slug).join("-")}
                className="grid min-w-full grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-12"
              >
                {page.map((product) => (
                  <Link key={product.slug} href={`/products/${product.slug}`} className="group">
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-[#f7f7f7]">
                      <Image
                        src={product.images[0] ?? "/lumencraft/product-linea-pro.jpg"}
                        alt={product.name}
                        fill
                        className="object-contain p-2 transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="text-xl font-semibold tracking-normal text-black">{product.name}</h3>
                    <p className="mt-1 text-sm text-black/50">{product.family ?? product.categoryName}</p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {productPages.map((page, index) => (
            <button
              key={page[0]?.slug ?? index}
              onClick={() => setCurrentPage(index)}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentPage ? "bg-black/58" : "bg-black/14 hover:bg-black/30"
              }`}
              aria-label={`Go to product page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
