import type { ProjectCategory } from "@prisma/client";

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  location: string;
  designer: string | null;
  completionYear: string | null;
  categoryId: string;
  featuredImage: string;
  galleryImages: unknown;
  productsUsed: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  categories: ProjectCategory[];
  project?: ProjectRow | null;
  action: (formData: FormData) => Promise<void>;
};

function toLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (value as string[]).join("\n");
}

function toProductsUsedLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (value as { slug: string; name: string }[])
    .map((p) => `${p.slug}|${p.name}`)
    .join("\n");
}

export default function ProjectForm({ categories, project, action }: Props) {
  const isEdit = Boolean(project);

  return (
    <form action={action} className="grid gap-6 max-w-3xl">
      {project && <input type="hidden" name="id" value={project.id} />}

      {/* Core details */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Project Details</h2>
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Name <span className="text-red-500">*</span>
            <input
              name="name"
              defaultValue={project?.name ?? ""}
              required
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Slug <span className="text-red-500">*</span>
            <input
              name="slug"
              defaultValue={project?.slug ?? ""}
              required
              pattern="[a-z0-9-]+"
              className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40"
              placeholder="e.g. city-centre-office"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Category <span className="text-red-500">*</span>
            <select
              name="categoryId"
              defaultValue={project?.categoryId ?? ""}
              required
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40 bg-white"
            >
              <option value="">Select a category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Short description
            <textarea
              name="shortDescription"
              defaultValue={project?.shortDescription ?? ""}
              rows={2}
              className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
              placeholder="One-line summary shown in cards"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description <span className="text-red-500">*</span>
            <textarea
              name="description"
              defaultValue={project?.description ?? ""}
              rows={6}
              required
              className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
            />
          </label>
        </div>
      </section>

      {/* Location & attribution */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Location & Attribution</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Location <span className="text-red-500">*</span>
            <input
              name="location"
              defaultValue={project?.location ?? ""}
              required
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              placeholder="e.g. Dubai, UAE"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Designer / Architect
            <input
              name="designer"
              defaultValue={project?.designer ?? ""}
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Completion year
            <input
              name="completionYear"
              defaultValue={project?.completionYear ?? ""}
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              placeholder="e.g. 2023"
            />
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Images</h2>
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Featured image URL <span className="text-red-500">*</span>
            <input
              name="featuredImage"
              defaultValue={project?.featuredImage ?? ""}
              required
              className="border border-black/15 px-3 py-3 font-mono text-sm outline-none focus:border-black/40"
              placeholder="https://…"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Gallery images
            <span className="text-xs font-normal text-black/50">One URL per line</span>
            <textarea
              name="galleryImages"
              defaultValue={toLines(project?.galleryImages)}
              rows={4}
              className="border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
              placeholder={"https://…\nhttps://…"}
            />
          </label>
        </div>
      </section>

      {/* Products used */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Products Used</h2>
        <label className="grid gap-2 text-sm font-medium">
          Products
          <span className="text-xs font-normal text-black/50">One product per line — format: <code className="font-mono">slug|Product Name</code></span>
          <textarea
            name="productsUsed"
            defaultValue={toProductsUsedLines(project?.productsUsed)}
            rows={4}
            className="border border-black/15 px-3 py-3 font-mono text-xs outline-none focus:border-black/40"
            placeholder={"alpha-series|Alpha Series\nbeta-downlight|Beta Downlight"}
          />
        </label>
      </section>

      {/* SEO */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">SEO</h2>
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            SEO title
            <input
              name="seoTitle"
              defaultValue={project?.seoTitle ?? ""}
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            SEO description
            <textarea
              name="seoDescription"
              defaultValue={project?.seoDescription ?? ""}
              rows={2}
              className="border border-black/15 px-3 py-3 text-sm outline-none focus:border-black/40"
            />
          </label>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Publishing</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={project?.sortOrder ?? 0}
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={isEdit ? project?.isActive : true}
            />
            Active (show on live site after publishing)
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={project?.isFeatured ?? false}
            />
            Featured project
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
          {isEdit ? "Save Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
