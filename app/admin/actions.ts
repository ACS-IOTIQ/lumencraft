"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  createAdminSession,
  ensureBootstrapAdmin,
  getAdminSession,
  requireAdmin,
  requirePermission,
} from "@/lib/auth";
import { logAudit, getRequestIp } from "@/lib/audit";
import { ROLE_DEFAULT_PERMISSIONS, ROLES, resolvePermissions, type Permissions } from "@/lib/rbac";
import {
  getMediaUsageCount,
  publishDraftSite,
  seedDraftContent,
} from "@/lib/admin-cms";
import type { CmsAboutPage, CmsContactPage, CmsServicesPage } from "@/lib/cms-types";
import { generateBlogReadingTime } from "@/lib/blog-utils";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteAsset, getPublicAssetUrl, getStorageBucket, uploadAsset } from "@/lib/storage";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const ipAddress = await getRequestIp();
  let loginError: string | null = null;

  try {
    await ensureBootstrapAdmin();
    const user = await prisma.adminUser.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !valid) {
      await logAudit({
        userEmail: email,
        actionType: "LOGIN_FAILED",
        module: "auth",
        description: `Failed login attempt for ${email}`,
        metadata: { reason: !user ? "user_not_found" : "invalid_password" },
        ipAddress,
      });
      loginError = "invalid";
    } else if (!user.isActive) {
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        actionType: "LOGIN_FAILED",
        module: "auth",
        description: `Login attempt on deactivated account ${email}`,
        metadata: { reason: "account_inactive" },
        ipAddress,
      });
      loginError = "inactive";
    } else {
      await createAdminSession(user.id);
      await logAudit({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        actionType: "LOGIN",
        module: "auth",
        description: `${user.name || user.email} logged in`,
        ipAddress,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    loginError = "setup";
  }

  if (loginError) redirect(`/admin/login?error=${loginError}`);
  redirect("/admin");
}

export async function logoutAction() {
  const admin = await getAdminSession();
  if (admin) {
    await logAudit({
      userId: admin.id,
      userEmail: admin.email,
      userName: admin.name,
      actionType: "LOGOUT",
      module: "auth",
      description: `${admin.name || admin.email} logged out`,
      ipAddress: await getRequestIp(),
    });
  }
  await clearAdminSession();
  redirect("/admin/login");
}

// ─── Publishing ───────────────────────────────────────────────────────────────

export async function publishSiteAction() {
  const admin = await requirePermission("publish");
  await publishDraftSite();
  await logAudit({
    userId: admin.id,
    userEmail: admin.email,
    userName: admin.name,
    actionType: "PUBLISH",
    module: "settings",
    description: "Published website snapshot",
    ipAddress: await getRequestIp(),
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/resources");
  revalidatePath("/resources/[slug]", "page");
  redirect("/admin?published=1");
}

export async function initializeDraftsAction() {
  const admin = await requireAdmin();
  await seedDraftContent();
  await logAudit({
    userId: admin.id,
    userEmail: admin.email,
    userName: admin.name,
    actionType: "INITIALIZE",
    module: "settings",
    description: "Initialized draft content from seed",
    ipAddress: await getRequestIp(),
  });
  redirect("/admin?initialized=1");
}

// ─── Products ────────────────────────────────────────────────────────────────

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

export async function saveProductAction(formData: FormData) {
  const admin = await requireAdmin();
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
    { type: "datasheet", label: "Download Data Sheet", mediaId: String(formData.get("datasheetMediaId") ?? "") },
  ];

  for (const input of downloadInputs) {
    if (!input.mediaId) {
      await prisma.productDownload.deleteMany({ where: { productId: product.id, type: input.type } });
      continue;
    }
    await prisma.productDownload.upsert({
      where: { productId_type: { productId: product.id, type: input.type } },
      update: { mediaId: input.mediaId, label: input.label },
      create: { productId: product.id, mediaId: input.mediaId, type: input.type, label: input.label },
    });
  }

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "products",
    entityType: "product",
    entityId: product.id,
    description: `${id ? "Updated" : "Created"} product "${product.name}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/products/${product.id}?saved=1`);
}

export async function deleteProductAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
    await prisma.product.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "products",
      entityType: "product",
      entityId: id,
      description: `Deleted product "${product?.name ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/products");
}

// ─── Product Categories ───────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  icon: z.string().default("pixel"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function saveCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
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

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "categories",
    entityType: "product_category",
    entityId: category.id,
    description: `${id ? "Updated" : "Created"} category "${category.name}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/categories/${category.id}?saved=1`);
}

export async function deleteCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const category = await prisma.productCategory.findUnique({ where: { id }, select: { name: true } });
    await prisma.productCategory.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "categories",
      entityType: "product_category",
      entityId: id,
      description: `Deleted category "${category?.name ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/categories");
}

// ─── Homepage ────────────────────────────────────────────────────────────────

export async function saveHomeAction(formData: FormData) {
  const admin = await requireAdmin();

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

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "UPDATE",
    module: "homepage",
    description: `Updated homepage content (${heroSlides.length} slides, ${projects.length} projects, ${partners.length} partners)`,
    ipAddress: await getRequestIp(),
  });

  redirect("/admin/home?saved=1");
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function uploadMediaAction(formData: FormData) {
  const admin = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const key = `uploads/${Date.now()}-${safeName}`;

  await uploadAsset({ key, body: buffer, contentType: file.type || "application/octet-stream" });

  const asset = await prisma.mediaAsset.create({
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

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "UPLOAD",
    module: "media",
    entityType: "media_asset",
    entityId: asset.id,
    description: `Uploaded file "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`,
    ipAddress: await getRequestIp(),
  });

  redirect("/admin/media?uploaded=1");
}

export async function deleteMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/media");

  const usage = await getMediaUsageCount(id);
  if (usage > 0) redirect("/admin/media?error=in-use");

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (asset) {
    await deleteAsset(asset.key);
    await prisma.mediaAsset.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "media",
      entityType: "media_asset",
      entityId: id,
      description: `Deleted file "${asset.filename}"`,
      ipAddress: await getRequestIp(),
    });
  }

  redirect("/admin/media?deleted=1");
}

// ─── Blog Categories ──────────────────────────────────────────────────────────

const blogCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function saveBlogCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = blogCategorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });

  const category = id
    ? await prisma.blogCategory.update({ where: { id }, data: parsed })
    : await prisma.blogCategory.create({ data: parsed });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "blog_categories",
    entityType: "blog_category",
    entityId: category.id,
    description: `${id ? "Updated" : "Created"} resource category "${category.name}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/resources/categories/${category.id}?saved=1`);
}

export async function deleteBlogCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const category = await prisma.blogCategory.findUnique({ where: { id }, select: { name: true } });
    await prisma.blogCategory.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "blog_categories",
      entityType: "blog_category",
      entityId: id,
      description: `Deleted resource category "${category?.name ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/resources/categories");
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

const blogPostSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().optional(),
  author: z.string().default("Lumencraft Team"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export async function saveBlogPostAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = blogPostSchema.parse({
    categoryId: formData.get("categoryId") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    author: formData.get("author"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    seoImage: formData.get("seoImage") || undefined,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });

  const contentRaw = String(formData.get("content") ?? "{}");
  let content: unknown = {};
  try { content = JSON.parse(contentRaw); } catch { content = {}; }

  const tagsRaw = String(formData.get("tags") ?? "[]");
  let tags: unknown = [];
  try { tags = JSON.parse(tagsRaw); } catch { tags = []; }

  const coverMediaId = String(formData.get("coverMediaId") ?? "");
  let coverImageUrl: string | null = null;
  if (coverMediaId) {
    const media = await prisma.mediaAsset.findUnique({ where: { id: coverMediaId } });
    coverImageUrl = media?.url ?? null;
  }

  const readingTime = generateBlogReadingTime(content);
  const data = {
    ...parsed,
    content: content as Prisma.InputJsonValue,
    tags: tags as Prisma.InputJsonValue,
    coverMediaId: coverMediaId || null,
    coverImageUrl,
    readingTime,
  };

  const post = id
    ? await prisma.blogPost.update({ where: { id }, data })
    : await prisma.blogPost.create({ data });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "blog",
    entityType: "blog_post",
    entityId: post.id,
    description: `${id ? "Updated" : "Created"} article "${post.title}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/resources/${post.id}?saved=1`);
}

export async function deleteBlogPostAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } });
    await prisma.blogPost.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "blog",
      entityType: "blog_post",
      entityId: id,
      description: `Deleted article "${post?.title ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/resources");
}

// ─── Project Categories ───────────────────────────────────────────────────────

const projectCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function saveProjectCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = projectCategorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });

  const category = id
    ? await prisma.projectCategory.update({ where: { id }, data: parsed })
    : await prisma.projectCategory.create({ data: parsed });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "projects",
    entityType: "project_category",
    entityId: category.id,
    description: `${id ? "Updated" : "Created"} project category "${category.name}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/projects/categories/${category.id}?saved=1`);
}

export async function deleteProjectCategoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const category = await prisma.projectCategory.findUnique({ where: { id }, select: { name: true } });
    await prisma.projectCategory.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "projects",
      entityType: "project_category",
      entityId: id,
      description: `Deleted project category "${category?.name ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/projects/categories");
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const projectSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional(),
  description: z.string().min(1),
  location: z.string().min(1),
  designer: z.string().optional(),
  completionYear: z.string().optional(),
  featuredImage: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

function parseProductsUsed(raw: FormDataEntryValue | null): { slug: string; name: string }[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => {
      const [slug, ...nameParts] = line.split("|");
      return { slug: slug.trim(), name: nameParts.join("|").trim() };
    })
    .filter((p) => p.slug && p.name);
}

export async function saveProjectAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const parsed = projectSchema.parse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description"),
    location: formData.get("location"),
    designer: formData.get("designer") || undefined,
    completionYear: formData.get("completionYear") || undefined,
    featuredImage: formData.get("featuredImage"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
  });

  const galleryImages = splitLines(formData.get("galleryImages"));
  const productsUsed = parseProductsUsed(formData.get("productsUsed"));

  const project = id
    ? await prisma.project.update({
        where: { id },
        data: { ...parsed, galleryImages, productsUsed },
      })
    : await prisma.project.create({
        data: { ...parsed, galleryImages, productsUsed },
      });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: id ? "UPDATE" : "CREATE",
    module: "projects",
    entityType: "project",
    entityId: project.id,
    description: `${id ? "Updated" : "Created"} project "${project.name}"`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/projects/${project.id}?saved=1`);
}

export async function deleteProjectAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const project = await prisma.project.findUnique({ where: { id }, select: { name: true } });
    await prisma.project.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "projects",
      entityType: "project",
      entityId: id,
      description: `Deleted project "${project?.name ?? id}"`,
      ipAddress: await getRequestIp(),
    });
  }
  redirect("/admin/projects");
}

// ─── User Management ─────────────────────────────────────────────────────────

const adminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(ROLES),
  isActive: z.boolean().default(true),
});

export async function saveAdminUserAction(formData: FormData) {
  const admin = await requirePermission("users");
  const id = String(formData.get("id") ?? "");
  const ipAddress = await getRequestIp();

  const parsed = adminUserSchema.parse({
    name: formData.get("name"),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
  });

  const permissions: Permissions = {
    products: formData.get("perm_products") === "on",
    blog: formData.get("perm_blog") === "on",
    media: formData.get("perm_media") === "on",
    homepage: formData.get("perm_homepage") === "on",
    users: formData.get("perm_users") === "on",
    publish: formData.get("perm_publish") === "on",
  };

  if (id) {
    // Prevent admin from deactivating their own account
    if (id === admin.id && !parsed.isActive) redirect("/admin/users?error=cannot-deactivate-self");
    // Prevent removing own user management permission
    if (id === admin.id && !permissions.users) redirect("/admin/users?error=cannot-remove-own-users-perm");

    await prisma.adminUser.update({ where: { id }, data: { ...parsed, permissions } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "UPDATE",
      module: "users",
      entityType: "admin_user",
      entityId: id,
      description: `Updated user "${parsed.email}" (role: ${parsed.role})`,
      metadata: { role: parsed.role, isActive: parsed.isActive, permissions },
      ipAddress,
    });
  } else {
    const password = String(formData.get("password") ?? "");
    if (password.length < 8) redirect("/admin/users/new?error=password-too-short");

    const user = await prisma.adminUser.create({
      data: {
        ...parsed,
        passwordHash: await bcrypt.hash(password, 12),
        permissions,
      },
    });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "CREATE",
      module: "users",
      entityType: "admin_user",
      entityId: user.id,
      description: `Created user "${parsed.email}" with role ${parsed.role}`,
      metadata: { role: parsed.role, permissions },
      ipAddress,
    });
  }

  redirect("/admin/users?saved=1");
}

export async function deleteAdminUserAction(formData: FormData) {
  const admin = await requirePermission("users");
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) redirect("/admin/users?error=cannot-delete-self");

  const user = await prisma.adminUser.findUnique({ where: { id }, select: { email: true, name: true } });
  if (user) {
    await prisma.adminUser.delete({ where: { id } });
    await logAudit({
      userId: admin.id, userEmail: admin.email, userName: admin.name,
      actionType: "DELETE",
      module: "users",
      entityType: "admin_user",
      entityId: id,
      description: `Deleted user "${user.email}"`,
      ipAddress: await getRequestIp(),
    });
  }

  redirect("/admin/users?deleted=1");
}

export async function changeUserPasswordAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/users");

  // Can only reset others' passwords with users permission
  if (id !== admin.id && !admin.permissions.users) redirect("/admin?error=forbidden");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) redirect(`/admin/users/${id}?error=password-too-short`);
  if (password !== confirm) redirect(`/admin/users/${id}?error=password-mismatch`);

  await prisma.adminUser.update({
    where: { id },
    data: { passwordHash: await bcrypt.hash(password, 12) },
  });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "PASSWORD_CHANGE",
    module: "users",
    entityType: "admin_user",
    entityId: id,
    description: id === admin.id ? "Changed own password" : `Reset password for user ${id}`,
    ipAddress: await getRequestIp(),
  });

  redirect(`/admin/users/${id}?saved=1`);
}

// ─── About Page ───────────────────────────────────────────────────────────────

export async function saveAboutPageAction(formData: FormData) {
  const admin = await requireAdmin();

  const aboutPage: CmsAboutPage = {
    brandQuote: String(formData.get("brandQuote") ?? ""),
    brandSubtext: String(formData.get("brandSubtext") ?? ""),
    overviewParagraphs: String(formData.get("overviewParagraphs") ?? "")
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean),
    stats: parseJsonField(formData.get("stats"), []),
    capabilities: parseJsonField(formData.get("capabilities"), []),
    visionStatement: String(formData.get("visionStatement") ?? ""),
    ctaHeadline: String(formData.get("ctaHeadline") ?? ""),
    ctaBody: String(formData.get("ctaBody") ?? ""),
  };

  await prisma.siteSetting.upsert({
    where: { key: "about_page" },
    update: { value: aboutPage as Prisma.InputJsonValue },
    create: { key: "about_page", value: aboutPage as Prisma.InputJsonValue },
  });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "UPDATE",
    module: "about",
    description: "Updated About page content",
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

// ─── Services Page ────────────────────────────────────────────────────────────

export async function saveServicesPageAction(formData: FormData) {
  const admin = await requireAdmin();

  const servicesPage: CmsServicesPage = {
    heroHeadline: String(formData.get("heroHeadline") ?? ""),
    heroCopy: String(formData.get("heroCopy") ?? ""),
    services: parseJsonField(formData.get("services"), []),
    process: parseJsonField(formData.get("process"), []),
    whyItems: parseJsonField(formData.get("whyItems"), []),
    ctaHeadline: String(formData.get("ctaHeadline") ?? ""),
    ctaBody: String(formData.get("ctaBody") ?? ""),
  };

  await prisma.siteSetting.upsert({
    where: { key: "services_page" },
    update: { value: servicesPage as Prisma.InputJsonValue },
    create: { key: "services_page", value: servicesPage as Prisma.InputJsonValue },
  });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "UPDATE",
    module: "services",
    description: "Updated Services page content",
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/services");
  redirect("/admin/services?saved=1");
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export async function saveContactPageAction(formData: FormData) {
  const admin = await requireAdmin();

  const contactPage: CmsContactPage = {
    heroCopy: String(formData.get("heroCopy") ?? ""),
    details: parseJsonField(formData.get("details"), []),
    formHeading: String(formData.get("formHeading") ?? ""),
    formSubtext: String(formData.get("formSubtext") ?? ""),
  };

  await prisma.siteSetting.upsert({
    where: { key: "contact_page" },
    update: { value: contactPage as Prisma.InputJsonValue },
    create: { key: "contact_page", value: contactPage as Prisma.InputJsonValue },
  });

  await logAudit({
    userId: admin.id, userEmail: admin.email, userName: admin.name,
    actionType: "UPDATE",
    module: "contact",
    description: "Updated Contact page content",
    ipAddress: await getRequestIp(),
  });

  revalidatePath("/contact");
  redirect("/admin/contact?saved=1");
}
