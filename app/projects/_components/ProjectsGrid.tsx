"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CmsProject } from "@/lib/cms-types";

function MapPinIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
        d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M12 10.5h.01" />
    </svg>
  );
}

export default function ProjectsGrid({ projects }: { projects: CmsProject[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-[#888884]">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`flex h-9 w-9 items-center justify-center border transition ${
              view === "grid"
                ? "border-black bg-black text-white"
                : "border-[#e8e8e5] text-black/40 hover:border-black/30 hover:text-black"
            }`}
          >
            <svg className="h-[14px] w-[14px]" fill="currentColor" viewBox="0 0 14 14">
              <rect x="0" y="0" width="6" height="6" />
              <rect x="8" y="0" width="6" height="6" />
              <rect x="0" y="8" width="6" height="6" />
              <rect x="8" y="8" width="6" height="6" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`flex h-9 w-9 items-center justify-center border transition ${
              view === "list"
                ? "border-black bg-black text-white"
                : "border-[#e8e8e5] text-black/40 hover:border-black/30 hover:text-black"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[15px] text-[#888884]">No projects found in this category.</p>
          <Link href="/projects" className="mt-3 inline-block text-sm font-medium underline hover:text-black/60">
            View all projects
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group flex flex-col">
              <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
                <Image
                  src={project.featuredImage}
                  alt={project.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#888884]">
                  {project.categoryName}
                </p>
                <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-black">
                  {project.name}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-black/58">
                  <MapPinIcon />
                  {project.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[#e8e8e5]">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex items-start gap-6 py-6"
            >
              <div className="relative h-24 w-36 shrink-0 overflow-hidden bg-neutral-100 sm:h-28 sm:w-44">
                <Image
                  src={project.featuredImage}
                  alt={project.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="176px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#888884]">
                  {project.categoryName}
                  {project.completionYear && (
                    <span className="ml-3">{project.completionYear}</span>
                  )}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-black transition group-hover:text-black/70">
                  {project.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-black/58">
                  <MapPinIcon />
                  {project.location}
                </p>
                {project.shortDescription && (
                  <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-[#3a3a38]">
                    {project.shortDescription}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
