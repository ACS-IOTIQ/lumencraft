"use client";

import { useState } from "react";
import Link from "next/link";
import type { MediaAsset, ProductCategory } from "@prisma/client";
import { saveProductAction } from "@/app/admin/actions";
import { fallbackSiteContent } from "@/lib/cms-seed";

type ProductForEditor = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  series: string;
  family: string | null;
  shortDescription: string | null;
  description: string;
  badges: unknown;
  keyDetails: unknown;
  basicSpecs: unknown;
  technicalDetails: unknown;
  installationMethods: unknown;
  availableModels: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string | null }[];
  downloads: { type: string; mediaId: string }[];
} | null;

const JSON_FIELD_NAMES = [
  "badges",
  "keyDetails",
  "basicSpecs",
  "technicalDetails",
  "installationMethods",
  "availableModels",
] as const;

type JsonFieldName = (typeof JSON_FIELD_NAMES)[number];

function tryJson(value: string): string | null {
  if (!value.trim()) return null;
  try {
    JSON.parse(value);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid JSON";
  }
}

function pretty(value: unknown, fallback: unknown) {
  return JSON.stringify(value ?? fallback, null, 2);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-black">
      {label}
      {children}
    </label>
  );
}

const baseProduct = fallbackSiteContent.products[0];

export default function ProductEditor({
  product,
  categories,
  mediaAssets,
}: {
  product: ProductForEditor;
  categories: ProductCategory[];
  mediaAssets: MediaAsset[];
}) {
  const [jsonErrors, setJsonErrors] = useState<Partial<Record<JsonFieldName, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const ies = product?.downloads.find((d) => d.type === "ies")?.mediaId ?? "";
  const datasheet = product?.downloads.find((d) => d.type === "datasheet")?.mediaId ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const errors: Partial<Record<JsonFieldName, string>> = {};
    let hasError = false;

    for (const field of JSON_FIELD_NAMES) {
      const el = form.elements.namedItem(field) as HTMLTextAreaElement | null;
      const err = el ? tryJson(el.value) : null;
      if (err) {
        errors[field] = err;
        hasError = true;
      }
    }

    setJsonErrors(errors);
    if (hasError) {
      e.preventDefault();
      setGlobalError("Fix the JSON errors below before saving.");
      const firstBad = JSON_FIELD_NAMES.find((f) => errors[f]);
      if (firstBad) {
        const el = form.elements.namedItem(firstBad) as HTMLElement | null;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setGlobalError(null);
    }
  }

  return (
    <form action={saveProductAction} onSubmit={handleSubmit} className="grid gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {globalError && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</p>
      )}

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Overview</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Product name">
            <input name="name" defaultValue={product?.name ?? ""} className="border border-black/15 px-3 py-3" required />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={product?.slug ?? ""} className="border border-black/15 px-3 py-3" required />
          </Field>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Category</span>
              <Link href="/admin/categories/new" className="text-xs font-medium text-black/50 hover:text-black underline">
                + New category
              </Link>
            </div>
            <select name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id} className="border border-black/15 px-3 py-3">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Field label="Series">
            <input name="series" defaultValue={product?.series ?? "Commercial Series"} className="border border-black/15 px-3 py-3" />
          </Field>
          <Field label="Family / category line">
            <input name="family" defaultValue={product?.family ?? ""} className="border border-black/15 px-3 py-3" />
          </Field>
          <Field label="Sort order">
            <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} className="border border-black/15 px-3 py-3" />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} />
            Visible on public site after publish
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} />
            Feature on homepage
          </label>
        </div>
        <div className="mt-5 grid gap-5">
          <Field label="Short description">
            <input name="shortDescription" defaultValue={product?.shortDescription ?? ""} className="border border-black/15 px-3 py-3" />
          </Field>
          <Field label="Long description">
            <textarea name="description" defaultValue={product?.description ?? ""} rows={6} className="border border-black/15 px-3 py-3" required />
          </Field>
        </div>
      </section>

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Gallery</h2>
        <Field label="Image URLs, one per line">
          <textarea
            name="images"
            defaultValue={
              product
                ? product.images.map((i) => i.url).filter(Boolean).join("\n")
                : baseProduct.images.join("\n")
            }
            rows={5}
            className="border border-black/15 px-3 py-3 font-mono text-sm"
          />
        </Field>
        <p className="mt-2 text-xs text-black/45">
          Paste direct image URLs (one per line). To use uploaded media, copy its URL from the{" "}
          <Link href="/admin/media" className="underline">Media Library</Link>.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <JsonBox name="badges" title="Badges" value={pretty(product?.badges, baseProduct.badges)} error={jsonErrors.badges} />
        <JsonBox name="keyDetails" title="Key Details" value={pretty(product?.keyDetails, baseProduct.keyDetails)} error={jsonErrors.keyDetails} />
        <JsonBox name="basicSpecs" title="Basic Specifications" value={pretty(product?.basicSpecs, baseProduct.basicSpecs)} error={jsonErrors.basicSpecs} />
        <JsonBox name="technicalDetails" title="Technical Details" value={pretty(product?.technicalDetails, baseProduct.technicalDetails)} error={jsonErrors.technicalDetails} />
        <JsonBox name="installationMethods" title="Installation Methods" value={pretty(product?.installationMethods, baseProduct.installationMethods)} error={jsonErrors.installationMethods} />
        <JsonBox name="availableModels" title="Available Models" value={pretty(product?.availableModels, baseProduct.availableModels)} error={jsonErrors.availableModels} />
      </div>

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Downloads</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <MediaSelect name="iesMediaId" label="IES file" value={ies} mediaAssets={mediaAssets} />
          <MediaSelect name="datasheetMediaId" label="Data Sheet" value={datasheet} mediaAssets={mediaAssets} />
        </div>
        <p className="mt-3 text-xs text-black/45">
          Upload files in the{" "}
          <Link href="/admin/media" className="underline">Media Library</Link>{" "}
          then select them here.
        </p>
      </section>

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">SEO / Publish</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="SEO title">
            <input name="seoTitle" defaultValue={product?.seoTitle ?? ""} className="border border-black/15 px-3 py-3" />
          </Field>
          <Field label="SEO description">
            <input name="seoDescription" defaultValue={product?.seoDescription ?? ""} className="border border-black/15 px-3 py-3" />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button className="rounded-sm bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-black/80">
          Save Draft
        </button>
      </div>
    </form>
  );
}

function JsonBox({ name, title, value, error }: { name: string; title: string; value: string; error?: string }) {
  const [localError, setLocalError] = useState<string | null>(null);
  const displayError = error ?? localError;

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {displayError && (
          <span className="text-xs font-medium text-red-600">Invalid JSON</span>
        )}
      </div>
      <textarea
        name={name}
        defaultValue={value}
        rows={12}
        className={`w-full border px-3 py-3 font-mono text-xs outline-none transition ${
          displayError ? "border-red-400 bg-red-50/30" : "border-black/15 focus:border-black/40"
        }`}
        onBlur={(e) => setLocalError(tryJson(e.target.value))}
        onChange={(e) => {
          if (localError) setLocalError(tryJson(e.target.value));
        }}
      />
      {displayError && (
        <p className="mt-1.5 text-xs text-red-600">{displayError}</p>
      )}
    </section>
  );
}

function MediaSelect({
  name,
  label,
  value,
  mediaAssets,
}: {
  name: string;
  label: string;
  value: string;
  mediaAssets: MediaAsset[];
}) {
  return (
    <Field label={label}>
      <select name={name} defaultValue={value} className="border border-black/15 px-3 py-3">
        <option value="">No file assigned</option>
        {mediaAssets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.filename} ({asset.kind})
          </option>
        ))}
      </select>
    </Field>
  );
}
