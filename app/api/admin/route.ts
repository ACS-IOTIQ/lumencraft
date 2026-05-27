import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clearAdminSession, createAdminSession, ensureBootstrapAdmin, requireAdmin } from "@/lib/auth";
import { publishDraftSite, seedDraftContent } from "@/lib/admin-cms";
import { deleteAsset, getPublicAssetUrl, getStorageBucket, uploadAsset } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "login") {
    return handleLogin(request);
  }

  if (action === "logout") {
    return handleLogout();
  }

  if (action === "publish") {
    return handlePublish();
  }

  if (action === "seed") {
    return handleSeed();
  }

  if (action === "upload-media") {
    return handleUploadMedia(request);
  }

  if (action === "save-product") {
    return handleSaveProduct(request);
  }

  if (action === "save-homepage") {
    return handleSaveHomepage(request);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  try {
    const admin = await requireAdmin().catch(() => null);

    if (resource === "status") {
      const [products, categories, media, snapshot] = await Promise.all([
        prisma.product.count(),
        prisma.productCategory.count(),
        prisma.mediaAsset.count(),
        prisma.publishedSnapshot.findUnique({ where: { key: "site" } }),
      ]);
      return NextResponse.json({
        ok: true,
        admin: admin ? admin.email : null,
        products,
        categories,
        media,
        publishedAt: snapshot?.publishedAt ?? null,
      });
    }

    if (resource === "products") {
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const products = await prisma.product.findMany({
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
        include: { category: true, downloads: true },
      });
      return NextResponse.json({ products });
    }

    if (resource === "categories") {
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const categories = await prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } });
      return NextResponse.json({ categories });
    }

    if (resource === "media") {
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json({ assets });
    }

    if (resource === "homepage") {
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const [heroSlides, featuredProjects, partners, contactSetting] = await Promise.all([
        prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.featuredProject.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.technologyPartner.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.siteSetting.findUnique({ where: { key: "contact" } }),
      ]);
      return NextResponse.json({ heroSlides, featuredProjects, partners, contact: contactSetting?.value ?? {} });
    }

    if (resource === "product") {
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true, images: { orderBy: { sortOrder: "asc" } }, downloads: { include: { media: true } } },
      });
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ product });
    }

    return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

async function handleLogin(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    await ensureBootstrapAdmin();
    const user = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, email: user.email });
    await createAdminSession(user.id);
    return response;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login failed" }, { status: 500 });
  }
}

async function handleLogout() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}

async function handlePublish() {
  try {
    const admin = await requireAdmin().catch(() => null);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await publishDraftSite();
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
    return NextResponse.json({ ok: true, publishedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Publish failed" }, { status: 500 });
  }
}

async function handleSeed() {
  try {
    const admin = await requireAdmin().catch(() => null);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedDraftContent();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Seed failed" }, { status: 500 });
  }
}

async function handleUploadMedia(request: NextRequest) {
  try {
    const admin = await requireAdmin().catch(() => null);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

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

    return NextResponse.json({ ok: true, asset });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 500 });
  }
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
  badges: z.array(z.string()).default([]),
  keyDetails: z.array(z.unknown()).default([]),
  basicSpecs: z.array(z.unknown()).default([]),
  technicalDetails: z.array(z.unknown()).default([]),
  installationMethods: z.array(z.unknown()).default([]),
  availableModels: z.array(z.unknown()).default([]),
  images: z.array(z.string()).default([]),
  iesMediaId: z.string().optional(),
  datasheetMediaId: z.string().optional(),
});

async function handleSaveProduct(request: NextRequest) {
  try {
    const admin = await requireAdmin().catch(() => null);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, ...fields } = body as { id?: string } & Record<string, unknown>;
    const parsed = productSchema.parse(fields);
    const { images, iesMediaId, datasheetMediaId, ...productData } = parsed;

    const product = id
      ? await prisma.product.update({ where: { id }, data: productData })
      : await prisma.product.create({ data: productData });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({ productId: product.id, url, alt: product.name, sortOrder: index })),
      });
    }

    for (const { type, label, mediaId } of [
      { type: "ies", label: "Download IES file", mediaId: iesMediaId },
      { type: "datasheet", label: "Download Data Sheet", mediaId: datasheetMediaId },
    ]) {
      if (!mediaId) {
        await prisma.productDownload.deleteMany({ where: { productId: product.id, type } });
      } else {
        await prisma.productDownload.upsert({
          where: { productId_type: { productId: product.id, type } },
          update: { mediaId, label },
          create: { productId: product.id, mediaId, type, label },
        });
      }
    }

    return NextResponse.json({ ok: true, product });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Save failed" }, { status: 500 });
  }
}

async function handleSaveHomepage(request: NextRequest) {
  try {
    const admin = await requireAdmin().catch(() => null);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as {
      heroSlides?: { title: string; eyebrow: string; copy: string; image: string; align?: string; isActive?: boolean }[];
      featuredProjects?: { name: string; location: string; image: string; isActive?: boolean }[];
      partners?: { name: string; image: string; isActive?: boolean }[];
      contact?: Record<string, unknown>;
    };

    if (body.heroSlides !== undefined) {
      await prisma.heroSlide.deleteMany();
      if (body.heroSlides.length > 0) {
        await prisma.heroSlide.createMany({
          data: body.heroSlides.map((slide, index) => ({
            title: slide.title,
            eyebrow: slide.eyebrow,
            copy: slide.copy,
            imageUrl: slide.image,
            align: slide.align ?? "object-center",
            sortOrder: index,
            isActive: slide.isActive ?? true,
          })),
        });
      }
    }

    if (body.featuredProjects !== undefined) {
      await prisma.featuredProject.deleteMany();
      if (body.featuredProjects.length > 0) {
        await prisma.featuredProject.createMany({
          data: body.featuredProjects.map((project, index) => ({
            name: project.name,
            location: project.location,
            imageUrl: project.image,
            sortOrder: index,
            isActive: project.isActive ?? true,
          })),
        });
      }
    }

    if (body.partners !== undefined) {
      await prisma.technologyPartner.deleteMany();
      if (body.partners.length > 0) {
        await prisma.technologyPartner.createMany({
          data: body.partners.map((partner, index) => ({
            name: partner.name,
            imageUrl: partner.image,
            sortOrder: index,
            isActive: partner.isActive ?? true,
          })),
        });
      }
    }

    if (body.contact !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key: "contact" },
        update: { value: body.contact },
        create: { key: "contact", value: body.contact },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Save homepage failed" }, { status: 500 });
  }
}
