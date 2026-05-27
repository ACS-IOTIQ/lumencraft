"use client";

import { useState } from "react";
import { saveHomeAction } from "@/app/admin/actions";

// ---------- Types ----------

type HeroSlide = {
  title: string;
  eyebrow: string;
  copy: string;
  image: string;
  align: string;
  isActive: boolean;
};

type FeaturedProject = {
  name: string;
  location: string;
  image: string;
  isActive: boolean;
};

type Partner = {
  name: string;
  image: string;
  isActive: boolean;
};

type Contact = {
  eyebrow: string;
  headlines: string[];
  email: string;
  phone: string;
  background: string;
};

// ---------- Shared utilities ----------

function tryParse(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

function JsonArea({ value, onChange, onBlurError }: {
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
      rows={14}
      spellCheck={false}
      className="w-full border border-black/15 px-3 py-3 font-mono text-xs outline-none transition focus:border-black/40"
    />
  );
}

function SectionHeader({ title, mode, onToggle, error }: {
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
      className="absolute right-3 top-3 text-lg leading-none text-black/30 transition hover:text-black"
    >
      ×
    </button>
  );
}

function Inp({ value, onChange, placeholder, className = "" }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40 ${className}`}
    />
  );
}

// ---------- Hero Slides Editor ----------

const ALIGN_OPTIONS = ["object-left", "object-center", "object-right"];

function HeroSlidesEditor({ name, initial }: { name: string; initial: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const submitValue = mode === "ui" ? JSON.stringify(slides) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(slides, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      if (!Array.isArray(r.value)) { setJsonError("Expected an array of slide objects"); return; }
      setSlides(r.value as HeroSlide[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, key: keyof HeroSlide, val: string | boolean) {
    setSlides(slides.map((s, j) => j === i ? { ...s, [key]: val } : s));
  }

  const blank: HeroSlide = { title: "", eyebrow: "", copy: "", image: "", align: "object-center", isActive: true };

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title="Hero Slides" mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <div key={i} className="relative border border-black/10 p-5">
              <RemoveBtn onClick={() => setSlides(slides.filter((_, j) => j !== i))} />
              <div className="grid gap-3 pr-8">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-black/40">Eyebrow (small text above title)</p>
                    <Inp value={slide.eyebrow} onChange={(v) => update(i, "eyebrow", v)} placeholder="Architectural LED Lighting" className="w-full" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-black/40">Title</p>
                    <Inp value={slide.title} onChange={(v) => update(i, "title", v)} placeholder="Welcome to LumenCraft" className="w-full" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-black/40">Copy / Subtitle</p>
                  <textarea
                    value={slide.copy}
                    onChange={(e) => update(i, "copy", e.target.value)}
                    placeholder="Brief description shown on the hero…"
                    rows={2}
                    className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-xs font-medium text-black/40">Background image path</p>
                    <Inp value={slide.image} onChange={(v) => update(i, "image", v)} placeholder="/lumencraft/hero-green-fit.jpg" className="w-full" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-black/40">Image align</p>
                    <select
                      value={slide.align}
                      onChange={(e) => update(i, "align", e.target.value)}
                      className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
                    >
                      {ALIGN_OPTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={slide.isActive}
                    onChange={(e) => update(i, "isActive", e.target.checked)}
                  />
                  Active (visible on site)
                </label>
              </div>
            </div>
          ))}
          {slides.length === 0 && <p className="py-2 text-xs text-black/35">No slides yet.</p>}
          <AddRowBtn onClick={() => setSlides([...slides, blank])} label="+ Add slide" />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Featured Projects Editor ----------

function ProjectsEditor({ name, initial }: { name: string; initial: FeaturedProject[] }) {
  const [rows, setRows] = useState<FeaturedProject[]>(initial);
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
      setRows(r.value as FeaturedProject[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, key: keyof FeaturedProject, val: string | boolean) {
    setRows(rows.map((r, j) => j === i ? { ...r, [key]: val } : r));
  }

  const blank: FeaturedProject = { name: "", location: "", image: "", isActive: true };

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title="Featured Projects" mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-3">
          {rows.length > 0 && (
            <div className="mb-1 grid grid-cols-[1fr_1fr_1fr_auto] gap-x-3 text-xs font-semibold uppercase tracking-wider text-black/35">
              <span>Project name</span>
              <span>Location</span>
              <span>Image path</span>
              <span />
            </div>
          )}
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-3">
              <Inp value={row.name} onChange={(v) => update(i, "name", v)} placeholder="DRAGO" />
              <Inp value={row.location} onChange={(v) => update(i, "location", v)} placeholder="Cable Bridge, Hyderabad" />
              <Inp value={row.image} onChange={(v) => update(i, "image", v)} placeholder="/lumencraft/project-cable-structure.jpg" />
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                className="flex h-7 w-7 items-center justify-center text-lg leading-none text-black/30 transition hover:text-black"
              >
                ×
              </button>
            </div>
          ))}
          {rows.length === 0 && <p className="py-2 text-xs text-black/35">No projects yet.</p>}
          <AddRowBtn onClick={() => setRows([...rows, blank])} label="+ Add project" />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Partners Editor ----------

function PartnersEditor({ name, initial }: { name: string; initial: Partner[] }) {
  const [rows, setRows] = useState<Partner[]>(initial);
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
      setRows(r.value as Partner[]);
      setJsonError(null);
      setMode("ui");
    }
  }

  function update(i: number, key: keyof Partner, val: string | boolean) {
    setRows(rows.map((r, j) => j === i ? { ...r, [key]: val } : r));
  }

  const blank: Partner = { name: "", image: "", isActive: true };

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title="Technology Partners" mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="space-y-3">
          {rows.length > 0 && (
            <div className="mb-1 grid grid-cols-[1fr_2fr_auto] gap-x-3 text-xs font-semibold uppercase tracking-wider text-black/35">
              <span>Partner name</span>
              <span>Logo image path</span>
              <span />
            </div>
          )}
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-x-3">
              <Inp value={row.name} onChange={(v) => update(i, "name", v)} placeholder="SWISSON" />
              <Inp value={row.image} onChange={(v) => update(i, "image", v)} placeholder="/lumencraft/partner-swisson.jpg" className="w-full" />
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
                className="flex h-7 w-7 items-center justify-center text-lg leading-none text-black/30 transition hover:text-black"
              >
                ×
              </button>
            </div>
          ))}
          {rows.length === 0 && <p className="py-2 text-xs text-black/35">No partners yet.</p>}
          <AddRowBtn onClick={() => setRows([...rows, blank])} label="+ Add partner" />
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Contact Editor ----------

function ContactEditor({ name, initial }: { name: string; initial: Contact }) {
  const [data, setData] = useState<Contact>(initial);
  const [mode, setMode] = useState<"ui" | "json">("ui");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initial, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const submitValue = mode === "ui" ? JSON.stringify(data) : jsonText;

  function toggle() {
    if (mode === "ui") {
      setJsonText(JSON.stringify(data, null, 2));
      setJsonError(null);
      setMode("json");
    } else {
      const r = tryParse(jsonText);
      if (!r.ok) { setJsonError(r.error); return; }
      setData(r.value as Contact);
      setJsonError(null);
      setMode("ui");
    }
  }

  function set(key: keyof Contact, val: string | string[]) {
    setData({ ...data, [key]: val });
  }

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <input type="hidden" name={name} value={submitValue} />
      <SectionHeader title="Contact Section" mode={mode} onToggle={toggle} error={jsonError} />

      {mode === "ui" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-black/40">Eyebrow label</p>
              <Inp value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} placeholder="Let's Connect" className="w-full" />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-black/40">Background style</p>
              <Inp value={data.background ?? "diagonal"} onChange={(v) => set("background", v)} placeholder="diagonal" className="w-full" />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-black/40">Email</p>
              <Inp value={data.email ?? ""} onChange={(v) => set("email", v)} placeholder="info@lumencraft.co.in" className="w-full" />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-black/40">Phone</p>
              <Inp value={data.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="+91 XXXXXXXXXX" className="w-full" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-black/40">Headlines (one per line)</p>
            <textarea
              value={(data.headlines ?? []).join("\n")}
              onChange={(e) => set("headlines", e.target.value.split("\n"))}
              placeholder={"Get in touch. Let's work together!\nGot a specific project in mind?"}
              rows={3}
              className="w-full border border-black/15 px-2.5 py-2 text-sm outline-none focus:border-black/40"
            />
          </div>
        </div>
      ) : (
        <JsonArea value={jsonText} onChange={setJsonText} onBlurError={setJsonError} />
      )}
    </section>
  );
}

// ---------- Main HomeEditor ----------

export default function HomeEditor({
  heroSlides,
  featuredProjects,
  partners,
  contact,
}: {
  heroSlides: HeroSlide[];
  featuredProjects: FeaturedProject[];
  partners: Partner[];
  contact: Contact;
}) {
  const [globalError, setGlobalError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const fields = ["heroSlides", "featuredProjects", "partners", "contact"];
    const invalid = fields.filter((name) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      return el ? !tryParse(el.value).ok : false;
    });
    if (invalid.length > 0) {
      e.preventDefault();
      setGlobalError(`Fix JSON errors in: ${invalid.join(", ")}`);
    } else {
      setGlobalError(null);
    }
  }

  return (
    <form action={saveHomeAction} onSubmit={handleSubmit} className="grid gap-6">
      {globalError && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</p>
      )}
      <HeroSlidesEditor name="heroSlides" initial={heroSlides} />
      <ProjectsEditor name="featuredProjects" initial={featuredProjects} />
      <PartnersEditor name="partners" initial={partners} />
      <ContactEditor name="contact" initial={contact} />
      <div className="sticky bottom-4 flex justify-end">
        <button className="rounded-sm bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-black/80">
          Save Homepage Draft
        </button>
      </div>
    </form>
  );
}
