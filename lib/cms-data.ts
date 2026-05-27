import type { Prisma } from "@prisma/client";
import type { CmsCategory, CmsProduct, CmsSiteContent } from "@/lib/cms-types";
import { fallbackSiteContent } from "@/lib/cms-seed";
import { prisma } from "@/lib/prisma";

const SITE_SNAPSHOT_KEY = "site";

function asSiteContent(data: Prisma.JsonValue | null | undefined): CmsSiteContent | null {
  if (!data || typeof data !== "object") return null;
  const maybeSite = data as unknown as CmsSiteContent;
  if (!Array.isArray(maybeSite.categories) || !Array.isArray(maybeSite.products)) return null;
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

export { SITE_SNAPSHOT_KEY };
