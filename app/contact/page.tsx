import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPublishedSite } from "@/lib/cms-data";
import ContactForm from "./_components/ContactForm";

export const metadata = {
  title: "Contact Us | Lumencraft",
  description:
    "Get in touch with Lumencraft — project enquiries, product questions, or distribution partnerships.",
};

export default async function ContactPage() {
  const site = await getPublishedSite();
  const contact = site.contactPage;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      {/* Breadcrumb */}
      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">Contact</span>
        </div>
      </div>

      {/* Hero */}
      <header className="border-b border-[#e8e8e5] bg-[#f5f5f3] px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
          Let&apos;s Connect
        </p>
        <h1 className="mb-4 text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-black sm:text-[52px]">
          Contact us
        </h1>
        <p className="max-w-[540px] text-[15px] font-light leading-[1.75] text-[#3a3a38]">
          {contact.heroCopy}
        </p>
      </header>

      {/* Main content */}
      <section className="px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[1440px] grid grid-cols-1 gap-14 lg:grid-cols-[2fr_3fr] lg:gap-20">

          {/* Left: Contact details */}
          <div>
            <dl className="divide-y divide-[#e8e8e5]">
              {contact.details.map((block) => (
                <div key={block.label} className="py-6 first:pt-0">
                  <dt className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                    {block.label}
                  </dt>
                  <dd>
                    {block.items.map((item) =>
                      item.href ? (
                        <a
                          key={item.text}
                          href={item.href}
                          className="block text-[15px] font-medium text-black transition-colors hover:text-black/60"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <p key={item.text} className="text-[15px] font-light text-[#3a3a38]">
                          {item.text}
                        </p>
                      ),
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Quick links */}
            <div className="mt-10 border-t border-[#e8e8e5] pt-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                Explore
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "View our projects", href: "/projects" },
                  { label: "Browse products", href: "/products" },
                  { label: "Read our resources", href: "/resources" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between border border-[#e8e8e5] px-4 py-3 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
                  >
                    {link.label}
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <div className="border border-[#e8e8e5] bg-white p-8 sm:p-10">
              <div className="mb-8">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  Send us a message
                </p>
                <h2 className="text-2xl font-medium tracking-tight text-black">
                  {contact.formHeading}
                </h2>
                <p className="mt-2 text-sm font-light text-[#888884]">
                  {contact.formSubtext}
                </p>
              </div>
              <ContactForm />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
