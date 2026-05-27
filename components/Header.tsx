"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import type { CmsCategory } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

export default function Header({
  categories = fallbackSiteContent.categories,
}: {
  categories?: CmsCategory[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [productsDropdownPinned, setProductsDropdownPinned] = useState(false);
  const [activeProductCategory, setActiveProductCategory] = useState<string | null>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const productCategories = categories.map((category) => ({
    id: category.slug,
    name: category.name,
    href: `/products/${category.slug}`,
    products: category.products.slice(0, 6).map((product) => ({
      name: product.name,
      href: `/products/${product.slug}`,
    })),
  }));

  const activeCategory = productCategories.find((category) => category.id === activeProductCategory);

  const navItems = [
    { label: "Company", href: "/#company" },
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Resources", href: "/#resources" },
    { label: "Contact", href: "/#contact" },
  ];

  const closeProductsDropdown = useCallback(() => {
    setProductsDropdownOpen(false);
    setProductsDropdownPinned(false);
    setActiveProductCategory(null);
  }, []);

  useEffect(() => {
    if (!productsDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target as Node)
      ) {
        closeProductsDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProductsDropdown();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProductsDropdown, productsDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 text-black backdrop-blur">
      <nav className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Lumencraft home">
            <Logo markClassName="h-7 w-7" textClassName="text-2xl sm:text-[26px]" />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    ref={productsDropdownRef}
                    onMouseEnter={() => {
                      if (!productsDropdownOpen) setActiveProductCategory(null);
                      setProductsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (!productsDropdownPinned) {
                        setProductsDropdownOpen(false);
                        setActiveProductCategory(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (productsDropdownOpen && productsDropdownPinned) {
                          closeProductsDropdown();
                          return;
                        }

                        setProductsDropdownOpen(true);
                        setProductsDropdownPinned(true);
                        setActiveProductCategory(null);
                      }}
                      className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-colors hover:text-black/60"
                      aria-expanded={productsDropdownOpen}
                      aria-haspopup="menu"
                    >
                      {item.label}
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${
                          productsDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m6 9 6 6 6-6"
                        />
                      </svg>
                    </button>

                    {productsDropdownOpen && (
                      <div
                        className={`absolute left-0 top-full z-50 mt-2 flex border border-black/10 bg-white shadow-xl ${
                          activeCategory ? "w-[620px]" : "w-[230px]"
                        }`}
                      >
                        <div className="w-[230px] border-r border-black/10 py-3">
                          <Link
                            href="/products"
                            onClick={closeProductsDropdown}
                            className="block px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
                          >
                            All Products
                          </Link>
                          <div className="my-2 h-px bg-black/10" />
                          {productCategories.map((category) => {
                            const isActive = activeCategory?.id === category.id;

                            return (
                              <button
                                key={category.href}
                                type="button"
                                onMouseEnter={() => setActiveProductCategory(category.id)}
                                onFocus={() => setActiveProductCategory(category.id)}
                                onClick={() => {
                                  setActiveProductCategory(category.id);
                                  setProductsDropdownOpen(true);
                                  setProductsDropdownPinned(true);
                                }}
                                className={`flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                                  isActive
                                    ? "bg-black text-white"
                                    : "text-black/75 hover:bg-black/5 hover:text-black"
                                } w-full text-left`}
                              >
                                {category.name}
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m9 5 7 7-7 7"
                                  />
                                </svg>
                              </button>
                            );
                          })}
                        </div>

                        {activeCategory && (
                          <div className="min-h-[320px] flex-1 p-5">
                            <div className="mb-4 flex items-center justify-between gap-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                                {activeCategory.name}
                              </p>
                              <Link
                                href={activeCategory.href}
                                onClick={closeProductsDropdown}
                                className="text-xs font-medium text-black/55 transition hover:text-black"
                              >
                                View category
                              </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {activeCategory.products.map((product) => (
                                <Link
                                  key={product.href}
                                  href={product.href}
                                  onClick={closeProductsDropdown}
                                  className="group flex items-center justify-between border-b border-black/8 px-1 py-3 text-sm text-black transition hover:text-black/60"
                                >
                                  <span>{product.name}</span>
                                  <svg
                                    className="h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="m9 5 7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-black transition-colors hover:text-black/60"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-black/10 py-5 md:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => {
                          setProductsDropdownPinned(false);
                          setProductsDropdownOpen(!productsDropdownOpen);
                        }}
                        className="w-full flex items-center justify-between px-1 py-3 text-base font-medium text-black/80 transition-colors hover:text-black"
                      >
                        {item.label}
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            productsDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m6 9 6 6 6-6"
                          />
                        </svg>
                      </button>
                      {productsDropdownOpen && (
                        <div className="pl-4 pb-2">
                          <Link
                            href="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-1 py-2 text-sm text-black font-medium"
                          >
                            All Products
                          </Link>
                          {productCategories.map((category) => (
                            <div key={category.href} className="border-t border-black/8 py-2 first:border-t-0">
                              <Link
                                href={category.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-1 py-2 text-sm font-medium text-black/85 hover:text-black"
                              >
                                {category.name}
                              </Link>
                              <div className="grid gap-1 pl-3">
                                {category.products.slice(0, 4).map((product) => (
                                  <Link
                                    key={product.href}
                                    href={product.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-1 py-1.5 text-xs text-black/55 hover:text-black"
                                  >
                                    {product.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-1 py-3 text-base font-medium text-black/80 transition-colors hover:text-black"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
