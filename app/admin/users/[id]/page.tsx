import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  PERMISSION_LABELS,
  resolvePermissions,
  type Role,
} from "@/lib/rbac";
import {
  saveAdminUserAction,
  deleteAdminUserAction,
  changeUserPasswordAction,
} from "@/app/admin/actions";

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const admin = await requirePermission("users");
  const { id } = await params;
  const { saved, error } = await searchParams;

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      permissions: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return (
      <AdminShell title="User Not Found">
        <p className="border border-black/10 bg-white p-6">This user no longer exists.</p>
      </AdminShell>
    );
  }

  const resolvedPerms = resolvePermissions(user.role, user.permissions);
  const isSelf = user.id === admin.id;

  const errorMessages: Record<string, string> = {
    "password-too-short": "Password must be at least 8 characters.",
    "password-mismatch": "Passwords do not match.",
    "cannot-deactivate-self": "You cannot deactivate your own account.",
    "cannot-remove-own-users-perm": "You cannot remove your own user management permission.",
  };

  return (
    <AdminShell title={`Edit: ${user.name || user.email}`}>
      <Link
        href="/admin/users"
        className="mb-6 inline-block text-sm font-medium text-black/50 hover:text-black"
      >
        ← All users
      </Link>

      {saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          User saved successfully.
        </p>
      )}
      {error && errorMessages[error] && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessages[error]}
        </p>
      )}

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-black/50">
        <span
          className={`inline-block px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[user.role as Role] ?? "bg-black/5 text-black/50"}`}
        >
          {ROLE_LABELS[user.role as Role] ?? user.role}
        </span>
        <span>Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
        <span>Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}</span>
        {isSelf && <span className="text-black/40">(your account)</span>}
      </div>

      {/* Edit form */}
      <form action={saveAdminUserAction} className="grid max-w-2xl gap-6">
        <input type="hidden" name="id" value={user.id} />

        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Account Details</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Full Name
              <input
                name="name"
                defaultValue={user.name}
                required
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email Address
              <input
                name="email"
                type="email"
                defaultValue={user.email}
                required
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
          </div>
        </section>

        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">Role & Permissions</h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Role
              <select
                name="role"
                defaultValue={user.role}
                className="border border-black/15 bg-white px-3 py-3 outline-none focus:border-black/40"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2">
              <p className="text-sm font-medium">Module Access</p>
              <div className="grid gap-2 rounded-sm border border-black/10 p-4">
                {(Object.keys(PERMISSION_LABELS) as (keyof typeof PERMISSION_LABELS)[]).map((key) => (
                  <label key={key} className="flex items-center gap-3 text-sm">
                    <input
                      name={`perm_${key}`}
                      type="checkbox"
                      defaultChecked={resolvedPerms[key]}
                    />
                    {PERMISSION_LABELS[key]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-black/10 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Status</h2>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={user.isActive}
              disabled={isSelf}
            />
            Active (can log in to admin)
            {isSelf && <span className="text-xs text-black/40">— cannot deactivate own account</span>}
          </label>
        </section>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/users"
            className="border border-black/20 px-6 py-3 text-sm font-medium transition hover:border-black"
          >
            Cancel
          </Link>
          <button className="bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-black/80">
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password */}
      <div className="mt-8 max-w-2xl">
        <form action={changeUserPasswordAction} className="rounded-sm border border-black/10 bg-white p-6">
          <input type="hidden" name="id" value={user.id} />
          <h2 className="mb-5 text-xl font-semibold">
            {isSelf ? "Change Password" : "Reset Password"}
          </h2>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              New Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
                placeholder="Min. 8 characters"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Confirm Password
              <input
                name="confirmPassword"
                type="password"
                required
                className="border border-black/15 px-3 py-3 outline-none focus:border-black/40"
              />
            </label>
          </div>
          <button className="mt-5 border border-black px-6 py-3 text-sm font-semibold transition hover:bg-black hover:text-white">
            {isSelf ? "Change Password" : "Reset Password"}
          </button>
        </form>
      </div>

      {/* Danger zone — can't delete own account */}
      {!isSelf && (
        <div className="mt-8 max-w-2xl">
          <form
            action={deleteAdminUserAction}
            className="rounded-sm border border-red-200 bg-red-50 p-6"
          >
            <input type="hidden" name="id" value={user.id} />
            <h2 className="text-lg font-semibold text-red-800">Danger zone</h2>
            <p className="mt-1 text-sm text-red-700">
              Permanently delete {user.name || user.email}. This cannot be undone.
            </p>
            <button className="mt-4 border border-red-700 px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-700 hover:text-white">
              Delete User
            </button>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
