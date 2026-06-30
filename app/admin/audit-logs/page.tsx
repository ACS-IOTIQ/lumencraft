import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 25;

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-800",
  LOGOUT: "bg-slate-100 text-slate-600",
  LOGIN_FAILED: "bg-red-100 text-red-700",
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-700",
  PUBLISH: "bg-purple-100 text-purple-800",
  UPLOAD: "bg-cyan-100 text-cyan-800",
  INITIALIZE: "bg-slate-100 text-slate-600",
  PASSWORD_CHANGE: "bg-orange-100 text-orange-700",
};

const MODULE_COLORS: Record<string, string> = {
  auth: "bg-slate-100 text-slate-700",
  users: "bg-indigo-100 text-indigo-800",
  products: "bg-amber-100 text-amber-800",
  categories: "bg-amber-50 text-amber-700",
  blog: "bg-green-100 text-green-800",
  blog_categories: "bg-green-50 text-green-700",
  media: "bg-cyan-100 text-cyan-800",
  homepage: "bg-purple-100 text-purple-800",
  settings: "bg-slate-100 text-slate-600",
};

const ALL_ACTIONS = [
  "LOGIN", "LOGOUT", "LOGIN_FAILED",
  "CREATE", "UPDATE", "DELETE",
  "PUBLISH", "UPLOAD", "INITIALIZE", "PASSWORD_CHANGE",
];

const ALL_MODULES = [
  "auth", "users", "products", "categories",
  "blog", "blog_categories", "media", "homepage", "settings",
];

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    action?: string;
    module?: string;
    user?: string;
    from?: string;
    to?: string;
    q?: string;
  }>;
}) {
  await requireAdmin();
  const p = await searchParams;

  const page = Math.max(1, parseInt(p.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  // Build prisma where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (p.action) where.actionType = p.action;
  if (p.module) where.module = p.module;
  if (p.user) where.userEmail = { contains: p.user, mode: "insensitive" };
  if (p.from || p.to) {
    where.createdAt = {};
    if (p.from) where.createdAt.gte = new Date(p.from);
    if (p.to) where.createdAt.lte = new Date(`${p.to}T23:59:59`);
  }
  if (p.q) {
    where.OR = [
      { description: { contains: p.q, mode: "insensitive" } },
      { userEmail: { contains: p.q, mode: "insensitive" } },
      { entityId: { contains: p.q, mode: "insensitive" } },
    ];
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Build query string helper
  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { ...p, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/admin/audit-logs${qs ? `?${qs}` : ""}`;
  }

  return (
    <AdminShell title="Audit Logs">
      {/* Filter bar */}
      <form method="GET" action="/admin/audit-logs" className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <input
          name="q"
          defaultValue={p.q ?? ""}
          placeholder="Search description / email…"
          className="border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black/40 xl:col-span-2"
        />
        <select name="action" defaultValue={p.action ?? ""} className="border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/40">
          <option value="">All actions</option>
          {ALL_ACTIONS.map((a) => (
            <option key={a} value={a}>{a.replace("_", " ")}</option>
          ))}
        </select>
        <select name="module" defaultValue={p.module ?? ""} className="border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-black/40">
          <option value="">All modules</option>
          {ALL_MODULES.map((m) => (
            <option key={m} value={m}>{m.replace("_", " ")}</option>
          ))}
        </select>
        <input
          name="from"
          type="date"
          defaultValue={p.from ?? ""}
          className="border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black/40"
        />
        <input
          name="to"
          type="date"
          defaultValue={p.to ?? ""}
          className="border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black/40"
        />
        <div className="flex gap-2 xl:col-span-6">
          <button className="bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80">
            Filter
          </button>
          <Link href="/admin/audit-logs" className="border border-black/20 px-5 py-2.5 text-sm font-medium transition hover:border-black">
            Clear
          </Link>
          <span className="ml-auto self-center text-sm text-black/50">
            {total.toLocaleString()} log{total !== 1 ? "s" : ""}
            {(p.action || p.module || p.user || p.from || p.to || p.q) ? " (filtered)" : ""}
          </span>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Time</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-4 py-3 text-left font-semibold">Module</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-black/10 last:border-0 hover:bg-black/[0.01]">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className="cursor-default text-black/70"
                    title={new Date(log.createdAt).toLocaleString("en-IN")}
                  >
                    {relativeTime(new Date(log.createdAt))}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{log.userName || "—"}</p>
                  <p className="text-xs text-black/50">{log.userEmail || "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold ${ACTION_COLORS[log.actionType] ?? "bg-black/5 text-black/50"}`}
                  >
                    {log.actionType.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium ${MODULE_COLORS[log.module] ?? "bg-black/5 text-black/50"}`}
                  >
                    {log.module.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="truncate">{log.description}</p>
                  {log.entityType && (
                    <p className="text-xs text-black/40">
                      {log.entityType}
                      {log.entityId ? ` · ${log.entityId.slice(0, 12)}…` : ""}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-black/50 whitespace-nowrap">
                  {log.ipAddress || "—"}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-black/40">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-black/50">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="border border-black/20 px-4 py-2 font-medium transition hover:border-black"
              >
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="border border-black/20 px-4 py-2 font-medium transition hover:border-black"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
