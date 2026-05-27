import { saveCategoryAction } from "@/app/admin/actions";

type CategoryForEditor = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  sortOrder: number;
  isActive: boolean;
} | null;

const ICONS = [
  { value: "pixel", label: "Pixel Lights" },
  { value: "pixelbar", label: "Pixel Bars" },
  { value: "washer", label: "Wall Washers" },
  { value: "flood", label: "Flood Lights" },
  { value: "flex", label: "Flex Linear" },
  { value: "controller", label: "DMX Controls" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-black">
      {label}
      {children}
    </label>
  );
}

export default function CategoryEditor({ category }: { category: CategoryForEditor }) {
  return (
    <form action={saveCategoryAction} className="grid gap-6">
      {category && <input type="hidden" name="id" value={category.id} />}

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Category Details</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Category name">
            <input
              name="name"
              defaultValue={category?.name ?? ""}
              className="border border-black/15 px-3 py-3"
              required
            />
          </Field>
          <Field label="Slug (lowercase, hyphens only)">
            <input
              name="slug"
              defaultValue={category?.slug ?? ""}
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
              className="border border-black/15 px-3 py-3 font-mono"
              required
            />
          </Field>
          <Field label="Icon">
            <select
              name="icon"
              defaultValue={category?.icon ?? "pixel"}
              className="border border-black/15 px-3 py-3"
            >
              {ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort order">
            <input
              name="sortOrder"
              type="number"
              defaultValue={category?.sortOrder ?? 0}
              className="border border-black/15 px-3 py-3"
            />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={category?.isActive ?? true}
            />
            Visible in navigation after publish
          </label>
        </div>
        <div className="mt-5">
          <Field label="Description">
            <textarea
              name="description"
              defaultValue={category?.description ?? ""}
              rows={3}
              className="border border-black/15 px-3 py-3"
            />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button className="rounded-sm bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-black/80">
          Save Category
        </button>
      </div>
    </form>
  );
}
