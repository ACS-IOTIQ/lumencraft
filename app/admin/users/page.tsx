import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS, ROLE_COLORS, type Role } from "@/lib/rbac";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const admin = await requirePermission("users");
  const params = await searchParams;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  const errorMessages: Record<string, string> = {
    "cannot-delete-self": "You cannot delete your own account.",
    "cannot-deactivate-self": "You cannot deactivate your own account.",
    "cannot-remove-own-users-perm": "You cannot remove your own user management permission.",
  };

  return (
    <AdminShell title="Users">
      {params.saved && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          User saved successfully.
        </p>
      )}
      {params.deleted && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          User deleted.
        </p>
      )}
      {params.error && errorMessages[params.error] && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessages[params.error]}
        </p>
      )}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-black/50">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/users/new"
          className="bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
        >
          Add User
        </Link>
      </div>

      <div className="overflow-hidden border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="px-5 py-3 text-left font-semibold">Name / Email</th>
              <th className="px-5 py-3 text-left font-semibold">Role</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Last Login</th>
              <th className="px-5 py-3 text-left font-semibold">Joined</th>
              <th className="px-5 py-3 text-left font-semibold" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-black/10 last:border-0 ${user.id === admin.id ? "bg-black/[0.015]" : ""}`}
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {user.name || "—"}
                    {user.id === admin.id && (
                      <span className="ml-2 text-xs font-normal text-black/40">(you)</span>
                    )}
                  </p>
                  <p className="text-black/50">{user.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[user.role as Role] ?? "bg-black/5 text-black/50"}`}
                  >
                    {ROLE_LABELS[user.role as Role] ?? user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-black/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-black/50">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Never"}
                </td>
                <td className="px-5 py-4 text-black/50">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/40">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
