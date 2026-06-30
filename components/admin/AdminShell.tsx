import Link from "next/link";
import Logo from "@/components/Logo";
import { logoutAction } from "@/app/admin/actions";

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/home", label: "Homepage" },
    { href: "/admin/about", label: "About" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/contact", label: "Contact" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/resources", label: "Resources" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/audit-logs", label: "Audit Logs" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-black">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-white px-6 py-7 lg:block">
        <Link href="/admin" className="block">
          <Logo markClassName="h-8 w-8" textClassName="text-2xl" />
        </Link>
        <nav className="mt-10 grid gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-4 py-3 text-sm font-medium text-black/70 transition hover:bg-black hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="absolute bottom-7 left-6 right-6">
          <button className="w-full rounded-sm border border-black px-4 py-3 text-sm font-medium transition hover:bg-black hover:text-white">
            Logout
          </button>
        </form>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 px-6 py-5 backdrop-blur lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                LumenCraft Admin
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">{title}</h1>
            </div>
            <div className="flex gap-3 lg:hidden">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <div className="px-6 py-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
