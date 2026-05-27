"use client";

import { useState } from "react";
import Image from "next/image";
import type { CmsFeaturedProject } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";

function chunkProjects(projects: CmsFeaturedProject[]) {
  const pages: CmsFeaturedProject[][] = [];
  for (let index = 0; index < projects.length; index += 4) {
    pages.push(projects.slice(index, index + 4));
  }
  return pages.length ? pages : [fallbackSiteContent.featuredProjects.slice(0, 4)];
}

export default function FeaturedProjects({
  projects = fallbackSiteContent.featuredProjects,
}: {
  projects?: CmsFeaturedProject[];
}) {
  const projectPages = chunkProjects(projects);
  const [currentPage, setCurrentPage] = useState(0);

  const nextSlide = () => {
    setCurrentPage((page) => (page + 1) % projectPages.length);
  };

  const prevSlide = () => {
    setCurrentPage((page) => (page - 1 + projectPages.length) % projectPages.length);
  };

  return (
    <section id="projects" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <div className="mb-12 flex items-center justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-normal text-black sm:text-4xl">
            Featured Projects
          </h2>
          <div className="flex gap-3" aria-label="Project carousel controls">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Previous projects"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 19-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center border border-black/15 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Next projects"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {projectPages.map((page) => (
              <div
                key={page.map((project) => project.id).join("-")}
                className="grid min-w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              >
                {page.map((project) => (
                  <article key={project.id} className="group">
                    <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-normal text-black">{project.name}</h3>
                    <p className="mt-3 flex items-center gap-2 text-xs font-medium text-black/58">
                      <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.9}
                          d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M12 10.5h.01" />
                      </svg>
                      {project.location}
                    </p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {projectPages.map((page, index) => (
            <button
              key={page[0]?.id ?? index}
              onClick={() => setCurrentPage(index)}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentPage ? "bg-black/58" : "bg-black/14 hover:bg-black/30"
              }`}
              aria-label={`Go to project page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
