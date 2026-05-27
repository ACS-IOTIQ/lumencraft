"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CmsHeroSlide } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

export default function Hero({
  slides = fallbackSiteContent.heroSlides,
}: {
  slides?: CmsHeroSlide[];
}) {
  const activeSlides = slides.length ? slides : fallbackSiteContent.heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % activeSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  const goToPrevious = () => {
    setCurrentSlide((slide) => (slide - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((slide) => (slide + 1) % activeSlides.length);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-black text-white"
      style={{ height: "clamp(560px, calc(100vh - 64px), 720px)" }}
    >
      <Image
        key={activeSlides[currentSlide].image}
        src={activeSlides[currentSlide].image}
        alt=""
        fill
        priority
        className={`object-cover ${activeSlides[currentSlide].align}`}
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.48)_36%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/28 to-transparent" />

      <button
        onClick={goToPrevious}
        className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/15 text-white transition hover:bg-white hover:text-black lg:flex"
        aria-label="Previous hero slide"
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m15 19-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/15 text-white transition hover:bg-white hover:text-black lg:flex"
        aria-label="Next hero slide"
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m9 5 7 7-7 7" />
        </svg>
      </button>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="max-w-[780px]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
            {activeSlides[currentSlide].eyebrow}
          </p>
          <h1 className="max-w-[860px] text-3xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-[34px]">
            {activeSlides[currentSlide].title}
          </h1>
          <p className="mt-6 max-w-[760px] text-lg font-light leading-snug text-white/90 sm:text-2xl lg:text-[26px]">
            {activeSlides[currentSlide].copy}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center border-2 border-white px-6 text-lg font-medium text-white transition hover:bg-white hover:text-black"
            >
              Let&apos;s Connect
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {activeSlides.map((slide, index) => (
          <button
            key={slide.image}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              currentSlide === index ? "w-9 bg-white" : "bg-white/45 hover:bg-white/75"
            }`}
            aria-label={`Go to hero slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
