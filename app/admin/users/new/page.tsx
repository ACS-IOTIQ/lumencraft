import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission } from "@/lib/auth";
import { saveAdminUserAction } from "@/app/admin/actions";
import { ROLES, ROLE_LABELS, ROLE_DEFAULT_PERMISSIONS, PERMISSION_LABELS, type Role } from "@/lib/rbac";

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("users");
  const params = await searchParams;

  return (
    <AdminShell title="New User">
      <Link
        href="/admin/users"
        className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black"
      >
        ← All users
      </Link>

      {params.error === "password-too-short" && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Password must be at least 8 characters.
        </p>
      )}

      <UserForm />
    </AdminShell>
  );
}

function UserForm({ user, defaultRole = "editor" }: { user?: null; defaultRole?: Role }) {
  const perms = ROLE_DEFAULT_PERMISSIONS[defaultRole];

  return (
    <form action={saveAdminUserAction} className="grid max-w-2xl gap-6">
      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold">Account Details</h2>
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Full Name
            <input
              name="name"
              required
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              placeholder="e.g. Ravi Sharma"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Email Address
            <input
              name="email"
              type="email"
              required
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              placeholder="e.g. ravi@lumencraft.co.in"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              placeholder="Min. 8 characters"
            />
          </label>
        </div>
      </section>

      <RolePermissionsSection defaultRole={defaultRole} />

      <section className="rounded-sm border border-black/10 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Status</h2>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input name="isActive" type="checkbox" defaultChecked />
          Active (can log in to admin)
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/users"
          className="border border-black/20 px-6 py-3 text-sm font-medium hover:border-black transition"
        >
          Cancel
        </Link>
        <button className="bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-black/80">
          Create User
        </button>
      </div>
    </form>
  );
}

function RolePermissionsSection({ defaultRole }: { defaultRole: Role }) {
  const perms = ROLE_DEFAULT_PERMISSIONS[defaultRole];

  return (
    <section className="rounded-sm border border-black/10 bg-white p-6">
      <h2 className="mb-5 text-xl font-semibold">Role & Permissions</h2>
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Role
          <select
            name="role"
            defaultValue={defaultRole}
            className="border border-black/15 px-3 py-3 outline-none focus:border-black/40 bg-white"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal text-black/50">
            Role sets default permissions. Customize below as needed.
          </span>
        </label>

        <div className="grid gap-2">
          <p className="text-sm font-medium">Module Access</p>
          <div className="grid gap-2 rounded-sm border border-black/10 p-4">
            {(Object.keys(PERMISSION_LABELS) as (keyof typeof PERMISSION_LABELS)[]).map((key) => (
              <label key={key} className="flex items-center gap-3 text-sm">
                <input
                  name={`perm_${key}`}
                  type="checkbox"
                  defaultChecked={perms[key]}
                />
                {PERMISSION_LABELS[key]}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
