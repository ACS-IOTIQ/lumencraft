"use client";

import { useState } from "react";
import Image from "next/image";
import type { CmsProduct } from "@/lib/cms-types";

export default function ProductDetailView({ product }: { product: CmsProduct }) {
  const [mainImage, setMainImage] = useState(0);
  const images = product.images.length ? product.images : ["/lumencraft/product-linea-pro.jpg"];
  const ies = product.downloads.find((download) => download.type === "ies");
  const datasheet = product.downloads.find((download) => download.type === "datasheet");

  return (
    <>
      <section className="bg-white px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-36">
            <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-sm border border-[#e8e8e5] bg-[#f5f5f3]">
              <Image
                src={images[mainImage]}
                alt={`${product.name} main`}
                fill
                className="object-contain p-9"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setMainImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-sm border bg-[#f5f5f3] transition ${
                    mainImage === index ? "border-black" : "border-[#e8e8e5] hover:border-black/50"
                  }`}
                  aria-label={`Show ${product.name} image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className={`object-contain p-2 transition ${mainImage === index ? "opacity-100" : "opacity-70"}`}
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#888884]">
              {product.categoryName} / {product.series}
            </p>
            <h1 className="mb-6 text-[38px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-5xl lg:text-[38px]">
              {product.name}
            </h1>
            <p className="mb-9 text-[15px] font-light leading-[1.75] text-[#3a3a38]">
              {product.description}
            </p>

            <div className="mb-9 flex flex-wrap gap-3 border-b border-[#e8e8e5] pb-7">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex h-9 min-w-[52px] items-center justify-center rounded-sm border border-[#e8e8e5] bg-[#f5f5f3] px-3 text-[11px] font-semibold tracking-[0.05em] text-[#3a3a38]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="grid gap-3.5">
              {product.keyDetails.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1 border-b border-dashed border-[#e8e8e5] py-2 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-6"
                >
                  <span className="text-[13px] font-normal tracking-[0.01em] text-[#888884]">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium tracking-[-0.005em] text-black">{item.value}</span>
                </div>
              ))}
            </div>

            {(ies || datasheet) && (
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {ies && (
                  <a
                    href={`/api/downloads/${ies.id}`}
                    className="flex min-h-12 items-center justify-center rounded-sm border-[1.5px] border-black bg-black px-7 text-center text-sm font-medium tracking-[0.02em] text-white transition hover:bg-[#3b6ff0] hover:border-[#3b6ff0]"
                  >
                    {ies.label}
                  </a>
                )}
                {datasheet && (
                  <a
                    href={`/api/downloads/${datasheet.id}`}
                    className="flex min-h-12 items-center justify-center rounded-sm border-[1.5px] border-black bg-white px-7 text-center text-sm font-medium tracking-[0.02em] text-black transition hover:bg-black hover:text-white"
                  >
                    {datasheet.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <SpecSection eyebrow="Overview" title="Basic Specifications" copy="Core electrical, optical, and physical parameters at a glance." alt>
        <div className="grid border-l border-t border-[#e8e8e5] bg-white sm:grid-cols-2 lg:grid-cols-3">
          {product.basicSpecs.map((spec) => (
            <div key={spec.label} className="border-b border-r border-[#e8e8e5] px-8 py-7">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#888884]">
                {spec.label}
              </p>
              <p className="text-[17px] font-medium tracking-[-0.01em] text-black">{spec.value}</p>
            </div>
          ))}
        </div>
      </SpecSection>

      <SpecSection
        eyebrow="Engineering"
        title="Technical Details"
        copy="Detailed mechanical, electrical, and environmental specifications for spec writers and installation teams."
      >
        <div className="grid border-t border-[#e8e8e5] pt-2 lg:grid-cols-2 lg:gap-x-20">
          {product.technicalDetails.map((detail) => (
            <div
              key={detail.label}
              className="grid gap-1 border-b border-[#e8e8e5] py-[18px] sm:grid-cols-[200px_1fr] sm:gap-6"
            >
              <span className="text-[13px] font-normal text-[#888884]">{detail.label}</span>
              <span className="text-sm font-medium tracking-[-0.005em] text-black">{detail.value}</span>
            </div>
          ))}
        </div>
      </SpecSection>

      <SpecSection
        eyebrow="On-site"
        title="Installation Methods"
        copy={`${product.name} supports standard mounting configurations to suit architectural surfaces.`}
        alt
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {product.installationMethods.map((method) => (
            <article
              key={method.id}
              className="flex flex-col items-center rounded-sm border border-[#e8e8e5] bg-white px-6 py-8 text-center transition hover:-translate-y-0.5 hover:border-black"
            >
              <div className="mb-5 flex aspect-[1.3/1] w-full items-center justify-center">
                <InstallIllustration type={method.id} />
              </div>
              <h3 className="mb-1.5 text-sm font-medium text-black">{method.title}</h3>
              <p className="text-xs font-light leading-[1.55] text-[#888884]">{method.description}</p>
            </article>
          ))}
        </div>
      </SpecSection>

      <SpecSection
        eyebrow="Variants"
        title="Available Models"
        copy={`Pick the right ${product.name} variant for your project.`}
      >
        <div className="overflow-x-auto rounded-sm border border-[#e8e8e5] bg-white">
          <table className="min-w-[720px] w-full border-collapse">
            <thead>
              <tr>
                {["Model", "Length", "Power", "Beam", "Output", "Colour modes"].map((heading) => (
                  <th key={heading} className="bg-[#f5f5f3] px-6 py-[18px] text-left text-[11px] font-medium uppercase tracking-[0.1em] text-[#888884]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.availableModels.map((model) => (
                <tr key={model.model} className="transition hover:bg-[#f5f5f3]">
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm font-medium tracking-[-0.01em] text-black">
                    {model.model}
                  </td>
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm text-black">{model.length}</td>
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm text-black">{model.power}</td>
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm text-black">{model.beam}</td>
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm text-black">
                    <span className="inline-block rounded-sm bg-[#f5f5f3] px-2.5 py-1 text-xs font-medium text-[#3a3a38]">
                      {model.output}
                    </span>
                  </td>
                  <td className="border-t border-[#e8e8e5] px-6 py-[22px] text-sm text-black">{model.colour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpecSection>
    </>
  );
}

function SpecSection({
  eyebrow,
  title,
  copy,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`${alt ? "bg-[#f5f5f3]" : "bg-white"} px-6 py-20 sm:px-10 lg:px-20`}>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#888884]">{eyebrow}</p>
      <h2 className="mb-3 text-[32px] font-medium tracking-[-0.03em] text-black">{title}</h2>
      <p className="mb-12 max-w-[680px] text-[15px] font-light leading-[1.7] text-[#888884]">{copy}</p>
      {children}
    </section>
  );
}

function InstallIllustration({ type }: { type: string }) {
  if (type === "recessed") {
    return (
      <svg viewBox="0 0 180 140" fill="none" stroke="#0a0a0a" strokeWidth="1.4" className="h-full max-h-[180px] w-full max-w-[190px]">
        <rect x="10" y="10" width="160" height="100" stroke="#888" strokeDasharray="3 3" />
        <path d="M10 70 L60 70 L60 90 L120 90 L120 70 L170 70" strokeWidth="2" />
        <rect x="65" y="74" width="50" height="12" rx="2" fill="#f5f5f3" />
        <path d="M70 86 L65 110 M80 86 L78 110 M90 86 L90 110 M100 86 L102 110 M110 86 L115 110" stroke="#3b6ff0" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (type === "bracket") {
    return (
      <svg viewBox="0 0 180 140" fill="none" stroke="#0a0a0a" strokeWidth="1.4" className="h-full max-h-[180px] w-full max-w-[190px]">
        <rect x="10" y="10" width="20" height="120" fill="#f5f5f3" />
        <line x1="30" y1="60" x2="60" y2="50" strokeWidth="2" />
        <line x1="30" y1="80" x2="60" y2="90" strokeWidth="2" />
        <circle cx="60" cy="70" r="4" fill="#0a0a0a" />
        <rect x="62" y="60" width="100" height="20" rx="3" fill="#f5f5f3" transform="rotate(-15 112 70)" />
        <path d="M115 70 L160 30 M120 80 L165 50 M125 90 L170 70" stroke="#3b6ff0" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (type === "pole") {
    return (
      <svg viewBox="0 0 180 140" fill="none" stroke="#0a0a0a" strokeWidth="1.4" className="h-full max-h-[180px] w-full max-w-[190px]">
        <line x1="10" y1="125" x2="170" y2="125" strokeWidth="2" />
        <rect x="86" y="40" width="8" height="85" fill="#f5f5f3" />
        <rect x="78" y="120" width="24" height="6" fill="#0a0a0a" />
        <rect x="60" y="32" width="60" height="14" rx="2" fill="#f5f5f3" />
        <path d="M70 46 L40 90 M85 46 L75 95 M95 46 L105 95 M110 46 L140 90" stroke="#3b6ff0" strokeDasharray="2 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 140" fill="none" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" className="h-full max-h-[180px] w-full max-w-[190px]">
      <rect x="10" y="10" width="160" height="100" stroke="#888" strokeDasharray="3 3" />
      <line x1="10" y1="110" x2="170" y2="110" strokeWidth="2" />
      <rect x="40" y="60" width="100" height="14" rx="2" fill="#f5f5f3" />
      <rect x="48" y="56" width="6" height="22" fill="#0a0a0a" />
      <rect x="126" y="56" width="6" height="22" fill="#0a0a0a" />
      <path d="M50 75 L30 105 M70 75 L62 105 M90 75 L90 105 M110 75 L118 105 M130 75 L150 105" stroke="#3b6ff0" strokeDasharray="2 2" />
    </svg>
  );
}
