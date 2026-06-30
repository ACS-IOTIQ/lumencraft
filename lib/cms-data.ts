import type { Prisma } from "@prisma/client";
import type { CmsBlogCategory, CmsBlogPost, CmsCategory, CmsProduct, CmsProject, CmsProjectCategory, CmsSiteContent } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";
import { prisma } from "@/lib/prisma";

const SITE_SNAPSHOT_KEY = "site";

function asSiteContent(data: Prisma.JsonValue | null | undefined): CmsSiteContent | null {
  if (!data || typeof data !== "object") return null;
  const maybeSite = data as unknown as CmsSiteContent;
  if (!Array.isArray(maybeSite.categories) || !Array.isArray(maybeSite.products)) return null;
  if (!Array.isArray(maybeSite.blogPosts)) maybeSite.blogPosts = [];
  if (!Array.isArray(maybeSite.blogCategories)) maybeSite.blogCategories = [];
  if (!Array.isArray(maybeSite.projects)) maybeSite.projects = [];
  if (!Array.isArray(maybeSite.projectCategories)) maybeSite.projectCategories = [];
  if (!maybeSite.aboutPage) maybeSite.aboutPage = fallbackSiteContent.aboutPage;
  if (!maybeSite.servicesPage) maybeSite.servicesPage = fallbackSiteContent.servicesPage;
  if (!maybeSite.contactPage) maybeSite.contactPage = fallbackSiteContent.contactPage;
  return maybeSite;
}

export async function getPublishedSite(): Promise<CmsSiteContent> {
  if (!process.env.DATABASE_URL) return fallbackSiteContent;

  try {
    const snapshot = await prisma.publishedSnapshot.findUnique({
      where: { key: SITE_SNAPSHOT_KEY },
    });
    return asSiteContent(snapshot?.data) ?? fallbackSiteContent;
  } catch {
    return fallbackSiteContent;
  }
}

export async function getPublishedCategories(): Promise<CmsCategory[]> {
  const site = await getPublishedSite();
  return site.categories;
}

export async function getPublishedProduct(slug: string): Promise<CmsProduct | null> {
  const site = await getPublishedSite();
  return site.products.find((product) => product.slug === slug) ?? null;
}

export async function getPublishedCategory(slug: string): Promise<CmsCategory | null> {
  const site = await getPublishedSite();
  return site.categories.find((category) => category.slug === slug) ?? null;
}

export async function getPublishedBlogPosts(): Promise<CmsBlogPost[]> {
  const site = await getPublishedSite();
  return site.blogPosts ?? [];
}

export async function getPublishedBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const site = await getPublishedSite();
  return (site.blogPosts ?? []).find((post) => post.slug === slug) ?? null;
}

export async function getPublishedBlogCategories(): Promise<CmsBlogCategory[]> {
  const site = await getPublishedSite();
  return site.blogCategories ?? [];
}

export async function getPublishedProjects(): Promise<CmsProject[]> {
  const site = await getPublishedSite();
  return site.projects ?? [];
}

export async function getPublishedProject(slug: string): Promise<CmsProject | null> {
  const site = await getPublishedSite();
  return (site.projects ?? []).find((p) => p.slug === slug) ?? null;
}

export async function getPublishedProjectCategories(): Promise<CmsProjectCategory[]> {
  const site = await getPublishedSite();
  return site.projectCategories ?? [];
}

export { SITE_SNAPSHOT_KEY };
