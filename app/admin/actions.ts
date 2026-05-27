"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, createAdminSession, ensureBootstrapAdmin, requireAdmin } from "@/lib/auth";
import {
  getMediaUsageCount,
  publishDraftSite,
  seedDraftContent,
} from "@/lib/admin-cms";
import { prisma } from "@/lib/prisma";
import { deleteAsset, getPublicAssetUrl, getStorageBucket, uploadAsset } from "@/lib/storage";

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function splitLines(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const productSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  series: z.string().min(1),
  family: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await ensureBootstrapAdmin();
    const user = await prisma.adminUser.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) redirect("/admin/login?error=invalid");

    await createAdminSession(user.id);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    redirect("/admin/login?error=setup");
  }

  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function publishSiteAction() {
  await requireAdmin();
  await publishDraftSite();
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  redirect("/admin?published=1");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const parsed = productSchema.parse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    series: formData.get("series"),
    family: formData.get("family"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });

  const product = id
    ? await prisma.product.update({
        where: { id },
        data: {
          ...parsed,
          badges: parseJsonField(formData.get("badges"), []),
          keyDetails: parseJsonField(formData.get("keyDetails"), []),
          basicSpecs: parseJsonField(formData.get("basicSpecs"), []),
          technicalDetails: parseJsonField(formData.get("technicalDetails"), []),
          installationMethods: parseJsonField(formData.get("installationMethods"), []),
          availableModels: parseJsonField(formData.get("availableModels"), []),
        },
      })
    : await prisma.product.create({
        data: {
          ...parsed,
          badges: parseJsonField(formData.get("badges"), []),
          keyDetails: parseJsonField(formData.get("keyDetails"), []),
          basicSpecs: parseJsonField(formData.get("basicSpecs"), []),
          technicalDetails: parseJsonField(formData.get("technicalDetails"), []),
          installationMethods: parseJsonField(formData.get("installationMethods"), []),
          availableModels: parseJsonField(formData.get("availableModels"), []),
        },
      });

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: splitLines(formData.get("images")).map((url, index) => ({
      productId: product.id,
      url,
      alt: product.name,
      sortOrder: index,
    })),
  });

  const downloadInputs = [
    { type: "ies", label: "Download IES file", mediaId: String(formData.get("iesMediaId") ?? "") },
    {
      type: "datasheet",
      label: "Download Data Sheet",
      mediaId: String(formData.get("datasheetMediaId") ?? ""),
    },
  ];

  for (const input of downloadInputs) {
    if (!input.mediaId) {
      await prisma.productDownload.deleteMany({
        where: { productId: product.id, type: input.type },
      });
      continue;
    }

    await prisma.productDownload.upsert({
      where: { productId_type: { productId: product.id, type: input.type } },
      update: { mediaId: input.mediaId, label: input.label },
      create: {
        productId: product.id,
        mediaId: input.mediaId,
        type: input.type,
        label: input.label,
      },
    });
  }

  redirect(`/admin/products/${product.id}?saved=1`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.product.delete({ where: { id } });
  redirect("/admin/products");
}

export async function saveHomeAction(formData: FormData) {
  await requireAdmin();

  const heroSlides = parseJsonField<
    { title: string; eyebrow: string; copy: string; image: string; align?: string; isActive?: boolean }[]
  >(formData.get("heroSlides"), []);
  const projects = parseJsonField<{ name: string; location: string; image: string; isActive?: boolean }[]>(
    formData.get("featuredProjects"),
    [],
  );
  const partners = parseJsonField<{ name: string; image: string; isActive?: boolean }[]>(
    formData.get("partners"),
    [],
  );
  const contact = parseJsonField(formData.get("contact"), {});

  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: heroSlides.map((slide, index) => ({
      title: slide.title,
      eyebrow: slide.eyebrow,
      copy: slide.copy,
      imageUrl: slide.image,
      align: slide.align ?? "object-center",
      sortOrder: index,
      isActive: slide.isActive ?? true,
    })),
  });

  await prisma.featuredProject.deleteMany();
  await prisma.featuredProject.createMany({
    data: projects.map((project, index) => ({
      name: project.name,
      location: project.location,
      imageUrl: project.image,
      sortOrder: index,
      isActive: project.isActive ?? true,
    })),
  });

  await prisma.technologyPartner.deleteMany();
  await prisma.technologyPartner.createMany({
    data: partners.map((partner, index) => ({
      name: partner.name,
      imageUrl: partner.image,
      sortOrder: index,
      isActive: partner.isActive ?? true,
    })),
  });

  await prisma.siteSetting.upsert({
    where: { key: "contact" },
    update: { value: contact },
    create: { key: "contact", value: contact },
  });

  redirect("/admin/home?saved=1");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const key = `uploads/${Date.now()}-${safeName}`;

  await uploadAsset({
    key,
    body: buffer,
    contentType: file.type || "application/octet-stream",
  });

  await prisma.mediaAsset.create({
    data: {
      key,
      bucket: getStorageBucket(),
      url: getPublicAssetUrl(key),
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      kind: file.type.startsWith("image/")
        ? "image"
        : file.name.toLowerCase().endsWith(".ies")
          ? "ies"
          : "document",
    },
  });

  redirect("/admin/media?uploaded=1");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/media");

  const usage = await getMediaUsageCount(id);
  if (usage > 0) redirect("/admin/media?error=in-use");

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (asset) {
    await deleteAsset(asset.key);
    await prisma.mediaAsset.delete({ where: { id } });
  }

  redirect("/admin/media?deleted=1");
}

export async function initializeDraftsAction() {
  await requireAdmin();
  await seedDraftContent();
  redirect("/admin?initialized=1");
}

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  icon: z.string().default("pixel"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });

  const category = id
    ? await prisma.productCategory.update({ where: { id }, data: parsed })
    : await prisma.productCategory.create({ data: parsed });

  redirect(`/admin/categories/${category.id}?saved=1`);
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.productCategory.delete({ where: { id } });
  redirect("/admin/categories");
}
