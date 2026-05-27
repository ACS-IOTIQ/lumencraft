"use client";

import { useState } from "react";
import Link from "next/link";
import type { MediaAsset, ProductCategory } from "@prisma/client";
import { saveProductAction } from "@/app/admin/actions";
import { fallbackSiteContent } from "@/lib/cms-seed";

// ---------- Domain types ----------

type LV = { label: string; value: string };
type InstallMethod = { id: string; title: string; description: string };
type ModelRow = {
  model: string;
  length: string;
  power: string;
  beam: string;
  output: string;
  colour: string;
};

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

// ---------- Utilities ----------

function safeArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function tryParse(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// ---------- Shared UI pieces ----------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-black">
      {label}
      {children}
    </label>
  );
}

function SectionHeader({
  title,
  mode,
  onToggle,
  error,
}: {
  title: string;
  mode: "ui" | "json";
  onToggle: () => void;
  error?: string | null;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 rounded-sm border border-black/20 px-3 py-1.5 text-xs font-medium text-black/60 transition hover:border-black hover:text-black"
      >
        {mode === "ui" ? "Switch to JSON" : "Switch to UI"}
      </button>
    </div>
  );
}

function JsonArea({
  value,
  onChange,
  onBlurError,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlurError: (e: string | null) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => {
        const r = tryParse(e.target.value);
        onBlurError(r.ok ? null : r.error);
      }}
      rows={12}
      spellCheck={false}
      className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none transition focus:border-black/40"
    />
  );
}

function AddRowBtn({ onClick, label = "+ Add row" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-black/20 px-4 py-2 text-xs font-medium text-black/50 transition hover:border-black/40 hover:text-black"
    >
      {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-transparent text-lg leading-none text-black/30 transition hover:border-black/15 hover:text-black"
    >
      ×
    </button>
  );
}

// ---------- Tags editor — badges: string[] ----------

function TagsEditor({ name, initial, title }: { name: string; initial: string[]; title: string }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const submitValue = mode === "ui" ? JSON.stringify(tags) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(tags, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      if (!Array.isArray(r.value)) { setJsonError("Expected a JSON array of strings"); return; }
      setTags(r.value as string[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function addTag() {
    const t = draft.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setDraft(""); }
  }

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title={title} mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-3">
          <div className="flex min-h-8 flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-sm bg-black px-2.5 py-1 text-xs font-medium text-white"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, j) => j !== i))}
                  className="leading-none opacity-50 transition hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length === 0 && <span className="text-xs text-black/35">No badges added yet</span>}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Type a badge (e.g. CE, IP67, DMX512)"
              className="flex-1 border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/40"
            />
            <button
              type="button"
              onClick={addTag}
              className="border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Label-Value editor — keyDetails / basicSpecs / technicalDetails ----------

function LabelValueEditor({ name, initial, title }: { name: string; initial: LV[]; title: string }) {
  const [rows, setRows] = useState<LV[]>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const submitValue = mode === "ui" ? JSON.stringify(rows) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(rows, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      if (!Array.isArray(r.value)) { setJsonError("Expected an array of {label, value} objects"); return; }
      setRows(r.value as LV[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, key: keyof LV, val: string) {
    setRows(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  }

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title={title} mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-2">
          {rows.length > 0 && (
            <div className="mb-1 grid grid-cols-[1fr_1fr_1.75rem] gap-x-2 text-xs font-semibold uppercase tracking-wider text-black/35">
              <span>Label</span>
              <span>Value</span>
              <span />
            </div>
          )}
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1.75rem] items-center gap-x-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="Label"
                className="border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => update(i, "value", e.target.value)}
                placeholder="Value"
                className="border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
              />
              <RemoveBtn onClick={() => setRows(rows.filter((_, j) => j !== i))} />
            </div>
          ))}
          {rows.length === 0 && <p className="py-2 text-xs text-black/35">No rows yet.</p>}
          <AddRowBtn onClick={() => setRows([...rows, { label: "", value: "" }])} />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Installation methods editor ----------

function InstallMethodEditor({ name, initial, title }: { name: string; initial: InstallMethod[]; title: string }) {
  const [rows, setRows] = useState<InstallMethod[]>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const submitValue = mode === "ui" ? JSON.stringify(rows) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(rows, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      if (!Array.isArray(r.value)) { setJsonError("Expected an array"); return; }
      setRows(r.value as InstallMethod[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, key: keyof InstallMethod, val: string) {
    setRows(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  }

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title={title} mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="relative border border-black/10 p-4">
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                aria-label="Remove"
                className="absolute right-3 top-3 text-lg leading-none text-black/30 transition hover:text-black"
              >
                ×
              </button>
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <p className="mb-1 text-xs font-medium text-black/40">ID / Key</p>
                  <input
                    type="text"
                    value={row.id}
                    onChange={(e) => update(i, "id", e.target.value)}
                    placeholder="surface"
                    className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-black/40">Title</p>
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => update(i, "title", e.target.value)}
                    placeholder="Surface Mount"
                    className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
                  />
                </div>
              </div>
              <div className="mt-3">
                <p className="mb-1 text-xs font-medium text-black/40">Description</p>
                <textarea
                  value={row.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  placeholder="Brief description of this installation method…"
                  rows={2}
                  className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
                />
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="py-2 text-xs text-black/35">No methods added yet.</p>}
          <AddRowBtn
            onClick={() => setRows([...rows, { id: "", title: "", description: "" }])}
            label="+ Add method"
          />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Available models editor ----------

const MODEL_COLS = ["model", "length", "power", "beam", "output", "colour"] as const;
type ModelKey = (typeof MODEL_COLS)[number];

function ModelsEditor({ name, initial, title }: { name: string; initial: ModelRow[]; title: string }) {
  const [rows, setRows] = useState<ModelRow[]>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const submitValue = mode === "ui" ? JSON.stringify(rows) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(rows, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      if (!Array.isArray(r.value)) { setJsonError("Expected an array of model objects"); return; }
      setRows(r.value as ModelRow[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, col: ModelKey, val: string) {
    setRows(rows.map((r, j) => (j === i ? { ...r, [col]: val } : r)));
  }

  const emptyRow: ModelRow = { model: "", length: "", power: "", beam: "", output: "", colour: "" };

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title={title} mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="relative border border-black/10 p-4">
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                aria-label="Remove"
                className="absolute right-3 top-3 text-lg leading-none text-black/30 transition hover:text-black"
              >
                ×
              </button>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pr-6 sm:grid-cols-3">
                {MODEL_COLS.map((col) => (
                  <div key={col}>
                    <p className="mb-1 text-xs font-medium capitalize text-black/40">{col}</p>
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) => update(i, col, e.target.value)}
                      placeholder={col}
                      className="w-full border border-black/15 px-2.5 py-1.5 text-sm outline-none focus:border-black/40"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="py-2 text-xs text-black/35">No models added yet.</p>}
          <AddRowBtn onClick={() => setRows([...rows, emptyRow])} label="+ Add model variant" />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Main product editor ----------

const base = fallbackSiteContent.products[0];

export default function ProductEditor({
  product,
  categories,
  mediaAssets,
}: {
  product: ProductForEditor;
  categories: ProductCategory[];
  mediaAssets: MediaAsset[];
}) {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const ies = product?.downloads.find((d) => d.type === "ies")?.mediaId ?? "";
  const datasheet = product?.downloads.find((d) => d.type === "datasheet")?.mediaId ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const structured = ["badges", "keyDetails", "basicSpecs", "technicalDetails", "installationMethods", "availableModels"];
    const invalid = structured.filter((name) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!el) return false;
      const r = tryParse(el.value);
      return !r.ok;
    });

    if (invalid.length > 0) {
      e.preventDefault();
      setGlobalError(`Fix JSON errors in: ${invalid.join(", ")}. Switch each field to JSON mode to see the error.`);
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

      {/* Overview */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Overview</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Product name">
            <input name="name" defaultValue={product?.name ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" required />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={product?.slug ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" required />
          </Field>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Category</span>
              <Link href="/admin/categories/new" className="text-xs font-medium text-black/50 underline hover:text-black">
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
            <input name="series" defaultValue={product?.series ?? "Commercial Series"} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </Field>
          <Field label="Family / category line">
            <input name="family" defaultValue={product?.family ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </Field>
          <Field label="Sort order">
            <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
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
            <input name="shortDescription" defaultValue={product?.shortDescription ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </Field>
          <Field label="Long description">
            <textarea name="description" defaultValue={product?.description ?? ""} rows={6} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" required />
          </Field>
        </div>
      </section>

      {/* Gallery */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Gallery</h2>
        <Field label="Image URLs, one per line">
          <textarea
            name="images"
            defaultValue={
              product
                ? product.images.map((i) => i.url).filter(Boolean).join("\n")
                : base.images.join("\n")
            }
            rows={5}
            className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40"
          />
        </Field>
        <p className="mt-2 text-xs text-black/45">
          One URL per line. Copy URLs from the{" "}
          <Link href="/admin/media" className="underline">Media Library</Link>.
        </p>
      </section>

      {/* Structured field editors */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TagsEditor
          name="badges"
          title="Badges"
          initial={safeArr<string>(product?.badges ?? base.badges)}
        />
        <LabelValueEditor
          name="keyDetails"
          title="Key Details"
          initial={safeArr<LV>(product?.keyDetails ?? base.keyDetails)}
        />
        <LabelValueEditor
          name="basicSpecs"
          title="Basic Specifications"
          initial={safeArr<LV>(product?.basicSpecs ?? base.basicSpecs)}
        />
        <LabelValueEditor
          name="technicalDetails"
          title="Technical Details"
          initial={safeArr<LV>(product?.technicalDetails ?? base.technicalDetails)}
        />
      </div>
      <InstallMethodEditor
        name="installationMethods"
        title="Installation Methods"
        initial={safeArr<InstallMethod>(product?.installationMethods ?? base.installationMethods)}
      />
      <ModelsEditor
        name="availableModels"
        title="Available Models"
        initial={safeArr<ModelRow>(product?.availableModels ?? base.availableModels)}
      />

      {/* Downloads */}
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

      {/* SEO */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">SEO</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="SEO title">
            <input name="seoTitle" defaultValue={product?.seoTitle ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
          </Field>
          <Field label="SEO description">
            <input name="seoDescription" defaultValue={product?.seoDescription ?? ""} className="border border-black/15 px-3 py-3 outline-none focus:border-black/40" />
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

// ---------- Media file selector ----------

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
