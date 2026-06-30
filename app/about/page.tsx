import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPublishedSite } from "@/lib/cms-data";

export const metadata = {
  title: "About Us | Lumencraft",
  description:
    "Lumencraft is India's specialist in DMX-controlled architectural and facade lighting — from concept to commissioning.",
};

const capabilityIcons = [
  <svg key="0" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z" />
  </svg>,
  <svg key="1" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 8 8-4M12 11 4 7M12 11v10" />
  </svg>,
  <svg key="2" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>,
];

export default async function AboutPage() {
  const site = await getPublishedSite();
  const about = site.aboutPage;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={site.categories} />

      {/* Breadcrumb */}
      <div className="sticky top-16 z-40 border-b border-[#e8e8e5] bg-white/95 px-6 py-3 backdrop-blur sm:px-10 lg:px-20">
        <div className="flex items-center gap-2 text-sm text-[#888884]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="text-[#e8e8e5]">/</span>
          <span className="text-black">About</span>
        </div>
      </div>

      {/* Hero */}
      <header className="border-b border-[#e8e8e5] bg-[#f5f5f3] px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
          The Company
        </p>
        <h1 className="mb-5 text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-black sm:text-[56px] lg:text-[64px]">
          We illuminate<br className="hidden sm:block" /> architecture.
        </h1>
        <p className="max-w-[600px] text-[16px] font-light leading-[1.75] text-[#3a3a38]">
          India&apos;s specialist in DMX-controlled architectural and facade lighting —
          from initial design consultancy through to supply, integration, and commissioning.
        </p>
      </header>

      {/* Brand Statement */}
      <section className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
        <div className="flex flex-col justify-center bg-[#0c0c0c] px-8 py-16 sm:px-12 lg:px-16 lg:py-24">
          <p className="text-[36px] font-light italic leading-[1.2] tracking-tight text-white sm:text-[42px] lg:text-[46px]">
            &ldquo;{about.brandQuote}&rdquo;
          </p>
          <p className="mt-6 text-[15px] font-light italic leading-relaxed text-white/45">
            {about.brandSubtext}
          </p>
        </div>
        <div className="flex flex-col justify-center border-t border-[#e8e8e5] bg-white px-8 py-16 sm:px-12 lg:border-l lg:border-t-0 lg:px-16 lg:py-24">
          <div className="max-w-[560px] space-y-6">
            {about.overviewParagraphs.map((para, i) => (
              <p key={i} className="text-[15px] font-light leading-[1.85] text-[#3a3a38]">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#e8e8e5] bg-black">
        <div className="mx-auto max-w-[1440px] grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {about.stats.map((stat) => (
            <div key={stat.value} className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
              <span className="text-[36px] font-medium leading-none tracking-tight text-white sm:text-[44px]">
                {stat.value}
              </span>
              <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
              How we work
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
              Concept to commissioning.
            </h2>
            <p className="mt-4 max-w-[520px] text-[15px] font-light leading-[1.75] text-[#3a3a38]">
              Every Lumencraft engagement follows the same principle: own the full scope, never hand off the hard parts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {about.capabilities.map((cap, i) => (
              <article key={cap.title} className="group border-t border-black/10 pt-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-black/15 text-black">
                  {capabilityIcons[i % capabilityIcons.length]}
                </div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
                  0{i + 1}
                </p>
                <h3 className="mb-4 text-xl font-semibold tracking-tight text-black">{cap.title}</h3>
                <p className="mb-6 text-sm font-light leading-[1.8] text-black/62">{cap.description}</p>
                <Link
                  href={cap.link}
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-black transition hover:text-black/55"
                >
                  {cap.linkLabel}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-y border-[#e8e8e5] bg-[#f5f5f3] px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888884]">
            Our vision
          </p>
          <p className="max-w-[900px] text-[26px] font-light leading-[1.45] tracking-tight text-black sm:text-[30px] lg:text-[34px]">
            {about.visionStatement}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{about.ctaHeadline}</h2>
            <p className="mt-2 text-sm font-light text-white/60">{about.ctaBody}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
