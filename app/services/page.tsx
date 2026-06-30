import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPublishedSite } from "@/lib/cms-data";

export const metadata = {
  title: "Services | Lumencraft",
  description:
    "Lighting design consulting, DMX programming, system integration, training, and full project management — Lumencraft's end-to-end service offering.",
};

const serviceIcons = [
  <svg key="0" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z" />
  </svg>,
  <svg key="1" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>,
  <svg key="2" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342" />
  </svg>,
  <svg key="3" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>,
  <svg key="4" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
  </svg>,
  <svg key="5" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>,
];

export default async function ServicesPage() {
  const site = await getPublishedSite();
  const svc = site.servicesPage;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      {/* Breadcrumb */}
      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">Services</span>
        </div>
      </div>

      {/* Hero */}
      <header className="border-b border-[#e8e8e5] bg-[#f5f5f3] px-6 py-14 sm:px-10 lg:px-20 lg:py-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
          What we do
        </p>
        <h1 className="mb-5 text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-black sm:text-[52px]">
          {svc.heroHeadline}
        </h1>
        <p className="max-w-[580px] text-[15px] font-light leading-[1.75] text-[#3a3a38]">
          {svc.heroCopy}
        </p>
      </header>

      {/* Services Grid */}
      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
            Our services
          </p>
          <div className="grid grid-cols-1 gap-px bg-[#e8e8e5] border border-[#e8e8e5] sm:grid-cols-2 lg:grid-cols-3">
            {svc.services.map((service, i) => (
              <article
                key={service.number}
                className="group relative bg-white p-8 transition-colors duration-300 hover:bg-[#0c0c0c] sm:p-10"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center border border-black/15 text-black transition-colors duration-300 group-hover:border-white/20 group-hover:text-white">
                  {serviceIcons[i % serviceIcons.length]}
                </div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884] transition-colors duration-300 group-hover:text-white/40">
                  {service.number}
                </p>
                <h3 className="mb-4 text-xl font-semibold leading-snug tracking-tight text-black transition-colors duration-300 group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-sm font-light leading-[1.85] text-black/58 transition-colors duration-300 group-hover:text-white/58">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-[#e8e8e5] bg-[#f5f5f3] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
              How we work
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
              Our process
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {svc.process.map((item, i) => (
              <div key={item.step} className="relative flex flex-col border-t border-black/10 pt-8 pb-10 lg:pr-10">
                {i < svc.process.length - 1 && (
                  <div className="absolute right-0 top-[27px] hidden h-px w-10 bg-black/10 lg:block" />
                )}
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center border border-black/20 text-[13px] font-semibold text-black">
                  {item.step}
                </span>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-black">{item.title}</h3>
                <p className="text-sm font-light leading-[1.8] text-[#3a3a38]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Lumencraft */}
      <section className="bg-white px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {svc.whyItems.map((item) => (
              <div key={item.label} className="border-t border-black/10 pt-7">
                <h3 className="mb-3 text-base font-semibold tracking-tight text-black">{item.label}</h3>
                <p className="text-sm font-light leading-[1.8] text-black/58">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{svc.ctaHeadline}</h2>
            <p className="mt-2 text-sm font-light text-white/60">{svc.ctaBody}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
