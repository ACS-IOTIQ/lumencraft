"use client";

import { useEffect, useState } from "react";
import type { CmsContact } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

export default function Contact({
  contact = fallbackSiteContent.contact,
}: {
  contact?: CmsContact;
}) {
  const headlines = contact.headlines.length ? contact.headlines : fallbackSiteContent.contact.headlines;
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeadlineIndex((index) => (index + 1) % headlines.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [headlines.length]);

  return (
    <section
      id="contact"
      className="bg-black py-20 text-white sm:py-24"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 42px, transparent 42px 140px)",
      }}
    >
      <div className="mx-auto max-w-[1180px] px-6 text-center sm:px-10">
        <p className="mb-3 text-lg font-light tracking-[0.18em] text-white/70">
          {contact.eyebrow}
        </p>
        <div className="mx-auto grid min-h-[92px] max-w-5xl place-items-center sm:min-h-[116px]">
          {headlines.map((headline, index) => (
            <h2
              key={headline}
              aria-hidden={headlineIndex !== index}
              className={`col-start-1 row-start-1 text-3xl font-light leading-tight tracking-normal transition duration-700 sm:text-5xl ${
                headlineIndex === index
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              {headline}
            </h2>
          ))}
        </div>
        <div className="mt-9 flex flex-col items-center justify-center gap-5 text-xl font-light sm:flex-row sm:gap-10">
          <a
            href={`mailto:${contact.email}`}
            className="border-b border-white/70 pb-2 transition hover:border-white hover:text-white/75"
          >
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
            className="border-b border-white/70 pb-2 transition hover:border-white hover:text-white/75"
          >
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
