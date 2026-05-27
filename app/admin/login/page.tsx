import Link from "next/link";
import Logo from "@/components/Logo";
import { loginAction } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f5f3] px-6">
      <section className="w-full max-w-md border border-black/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <Logo markClassName="h-9 w-9" textClassName="text-3xl" />
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
          Secure Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Sign in to manage LumenCraft</h1>
        {error && (
          <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error === "setup"
              ? "Database or admin setup is not ready. Start Postgres and check .env."
              : "Invalid email or password."}
          </p>
        )}
        <form action={loginAction} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input name="email" type="email" className="border border-black/15 px-3 py-3" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input name="password" type="password" className="border border-black/15 px-3 py-3" required />
          </label>
          <button className="mt-2 bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            Login
          </button>
        </form>
        <Link href="/" className="mt-6 block text-sm text-black/55 hover:text-black">
          Back to website
        </Link>
      </section>
    </main>
  );
}
