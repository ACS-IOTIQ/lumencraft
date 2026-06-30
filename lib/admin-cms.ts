import type {
  BlogCategory,
  BlogPost,
  HeroSlide,
  MediaAsset,
  Product,
  ProductCategory,
  ProductDownload,
  ProductImage,
  Project,
  ProjectCategory,
} from "@prisma/client";
import type {
  CmsAboutPage,
  CmsBlogCategory,
  CmsBlogPost,
  CmsContact,
  CmsContactPage,
  CmsProduct,
  CmsProject,
  CmsProjectCategory,
  CmsServicesPage,
  CmsSiteContent,
} from "@/lib/cms-types";
import { SITE_SNAPSHOT_KEY } from "@/lib/cms-data";
import { fallbackSiteContent as seedContent } from "@/lib/cms-seed";
import { prisma } from "@/lib/prisma";

type ProductWithRelations = Product & {
  category: ProductCategory;
  images: ProductImage[];
  downloads: (ProductDownload & { media: MediaAsset })[];
};

const defaultContact = seedContent.contact;

function jsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export function serializeProduct(product: ProductWithRelations): CmsProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    categoryHref: `/products/${product.category.slug}`,
    series: product.series,
    family: product.family ?? undefined,
    shortDescription: product.shortDescription ?? undefined,
    description: product.description,
    badges: jsonArray<string>(product.badges, []),
    keyDetails: jsonArray(product.keyDetails, []),
    basicSpecs: jsonArray(product.basicSpecs, []),
    technicalDetails: jsonArray(product.technicalDetails, []),
    installationMethods: jsonArray(product.installationMethods, []),
    availableModels: jsonArray(product.availableModels, []),
    images: product.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => image.url)
      .filter((url): url is string => Boolean(url)),
    downloads: product.downloads.map((download) => ({
      id: download.id,
      type: download.type,
      label: download.label,
    })),
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
  };
}

type BlogPostWithRelations = BlogPost & {
  category: BlogCategory | null;
};

export function serializeBlogPost(post: BlogPostWithRelations): CmsBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? undefined,
    content: (post.content ?? {}) as Record<string, unknown>,
    coverImage: post.coverImageUrl ?? undefined,
    author: post.author,
    tags: jsonArray<string>(post.tags, []),
    categoryId: post.categoryId ?? undefined,
    categorySlug: post.category?.slug,
    categoryName: post.category?.name,
    seoTitle: post.seoTitle ?? undefined,
    seoDescription: post.seoDescription ?? undefined,
    seoImage: post.seoImage ?? undefined,
    readingTime: post.readingTime,
    isFeatured: post.isFeatured,
    sortOrder: post.sortOrder,
    createdAt: post.createdAt.toISOString(),
  };
}

type ProjectWithCategory = Project & { category: ProjectCategory };

export function serializeProject(project: ProjectWithCategory): CmsProject {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortDescription: project.shortDescription ?? "",
    description: project.description,
    location: project.location,
    designer: project.designer ?? undefined,
    completionYear: project.completionYear ?? undefined,
    categoryId: project.category.id,
    categoryName: project.category.name,
    categorySlug: project.category.slug,
    featuredImage: project.featuredImage,
    galleryImages: jsonArray<string>(project.galleryImages, []),
    productsUsed: jsonArray<{ slug: string; name: string }>(project.productsUsed, []),
    isFeatured: project.isFeatured,
    sortOrder: project.sortOrder,
  };
}

export async function getAdminProjects() {
  return prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });
}

export async function getAdminProjectCategories() {
  return prisma.projectCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProjectEditorData(projectId?: string) {
  const [categories, project] = await Promise.all([
    prisma.projectCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    projectId
      ? prisma.project.findUnique({ where: { id: projectId }, include: { category: true } })
      : null,
  ]);
  return { categories, project };
}

export async function getAdminBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });
}

export async function getAdminBlogCategories() {
  return prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getBlogEditorData(postId?: string) {
  const [categories, mediaAssets, post] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.mediaAsset.findMany({ where: { kind: "image" }, orderBy: { createdAt: "desc" } }),
    postId
      ? prisma.blogPost.findUnique({ where: { id: postId }, include: { category: true } })
      : null,
  ]);

  return { categories, mediaAssets, post };
}

export async function seedDraftContent() {
  const categoryCount = await prisma.productCategory.count();
  if (categoryCount === 0) {
    for (const category of seedContent.categories) {
      const createdCategory = await prisma.productCategory.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          sortOrder: category.sortOrder,
        },
      });

      for (const product of category.products) {
        const createdProduct = await prisma.product.create({
          data: {
            categoryId: createdCategory.id,
            name: product.name,
            slug: product.slug,
            series: product.series,
            family: product.family,
            shortDescription: product.shortDescription,
            description: product.description,
            badges: product.badges,
            keyDetails: product.keyDetails,
            basicSpecs: product.basicSpecs,
            technicalDetails: product.technicalDetails,
            installationMethods: product.installationMethods,
            availableModels: product.availableModels,
            isFeatured: Boolean(product.isFeatured),
            sortOrder: product.sortOrder ?? 0,
          },
        });

        await prisma.productImage.createMany({
          data: product.images.map((url, index) => ({
            productId: createdProduct.id,
            url,
            alt: product.name,
            sortOrder: index,
          })),
        });
      }
    }
  }

  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({
      data: seedContent.heroSlides.map((slide, index) => ({
        title: slide.title,
        eyebrow: slide.eyebrow,
        copy: slide.copy,
        imageUrl: slide.image,
        align: slide.align,
        sortOrder: index,
      })),
    });
  }

  if ((await prisma.featuredProject.count()) === 0) {
    await prisma.featuredProject.createMany({
      data: seedContent.featuredProjects.map((project, index) => ({
        name: project.name,
        location: project.location,
        imageUrl: project.image,
        sortOrder: index,
      })),
    });
  }

  if ((await prisma.technologyPartner.count()) === 0) {
    await prisma.technologyPartner.createMany({
      data: seedContent.partners.map((partner, index) => ({
        name: partner.name,
        imageUrl: partner.image,
        sortOrder: index,
      })),
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "contact" },
    update: {},
    create: { key: "contact", value: defaultContact },
  });

  await prisma.siteSetting.upsert({
    where: { key: "about_page" },
    update: {},
    create: { key: "about_page", value: seedContent.aboutPage as unknown as Record<string, unknown> },
  });

  await prisma.siteSetting.upsert({
    where: { key: "services_page" },
    update: {},
    create: { key: "services_page", value: seedContent.servicesPage as unknown as Record<string, unknown> },
  });

  await prisma.siteSetting.upsert({
    where: { key: "contact_page" },
    update: {},
    create: { key: "contact_page", value: seedContent.contactPage as unknown as Record<string, unknown> },
  });

  if ((await prisma.projectCategory.count()) === 0) {
    await prisma.projectCategory.createMany({
      data: seedContent.projectCategories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      })),
    });
  }

  if ((await prisma.project.count()) === 0) {
    const dbCategories = await prisma.projectCategory.findMany();
    const slugToId = Object.fromEntries(dbCategories.map((c) => [c.slug, c.id]));
    for (const project of seedContent.projects) {
      const categoryId = slugToId[project.categorySlug];
      if (!categoryId) continue;
      await prisma.project.create({
        data: {
          categoryId,
          name: project.name,
          slug: project.slug,
          shortDescription: project.shortDescription,
          description: project.description,
          location: project.location,
          designer: project.designer,
          completionYear: project.completionYear,
          featuredImage: project.featuredImage,
          galleryImages: project.galleryImages,
          productsUsed: project.productsUsed,
          isFeatured: project.isFeatured ?? false,
          sortOrder: project.sortOrder ?? 0,
        },
      });
    }
  }
}

export async function serializeDraftSite(): Promise<CmsSiteContent> {
  await seedDraftContent();

  const [
    categories,
    products,
    heroSlides,
    featuredProjects,
    partners,
    contactSetting,
    aboutPageSetting,
    servicesPageSetting,
    contactPageSetting,
    blogCategories,
    blogPosts,
    projectCategories,
    projects,
  ] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            category: true,
            images: true,
            downloads: { include: { media: true } },
          },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      include: {
        category: true,
        images: true,
        downloads: { include: { media: true } },
      },
    }),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.featuredProject.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.technologyPartner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findUnique({ where: { key: "contact" } }),
    prisma.siteSetting.findUnique({ where: { key: "about_page" } }),
    prisma.siteSetting.findUnique({ where: { key: "services_page" } }),
    prisma.siteSetting.findUnique({ where: { key: "contact_page" } }),
    prisma.blogCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.blogPost.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    }),
    prisma.projectCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    }),
  ]);

  const serializedProducts = products.map((product) => serializeProduct(product));

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      icon: category.icon,
      sortOrder: category.sortOrder,
      products: category.products.map((product) => serializeProduct(product)),
    })),
    products: serializedProducts,
    heroSlides: heroSlides.map((slide: HeroSlide) => ({
      title: slide.title,
      eyebrow: slide.eyebrow,
      copy: slide.copy,
      image: slide.imageUrl,
      align: slide.align,
    })),
    featuredProducts: serializedProducts.filter((product) => product.isFeatured).slice(0, 12),
    featuredProjects: featuredProjects.map((project) => ({
      id: project.id,
      name: project.name,
      location: project.location,
      image: project.imageUrl,
    })),
    partners: partners.map((partner) => ({
      name: partner.name,
      image: partner.imageUrl,
    })),
    contact: (contactSetting?.value as unknown as CmsContact) ?? defaultContact,
    aboutPage: (aboutPageSetting?.value as unknown as CmsAboutPage) ?? seedContent.aboutPage,
    servicesPage: (servicesPageSetting?.value as unknown as CmsServicesPage) ?? seedContent.servicesPage,
    contactPage: (contactPageSetting?.value as unknown as CmsContactPage) ?? seedContent.contactPage,
    blogCategories: (blogCategories as BlogCategory[]).map(
      (cat): CmsBlogCategory => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? undefined,
        sortOrder: cat.sortOrder,
      }),
    ),
    blogPosts: (blogPosts as BlogPostWithRelations[]).map(serializeBlogPost),
    projects: (projects as ProjectWithCategory[]).map(serializeProject),
    projectCategories: (projectCategories as ProjectCategory[]).map(
      (cat): CmsProjectCategory => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      }),
    ),
  };
}

export async function publishDraftSite() {
  const site = await serializeDraftSite();
  return prisma.publishedSnapshot.upsert({
    where: { key: SITE_SNAPSHOT_KEY },
    update: { data: site, publishedAt: new Date() },
    create: { key: SITE_SNAPSHOT_KEY, data: site },
  });
}

export async function getAdminDashboardData() {
  await seedDraftContent();

  const [productCount, categoryCount, mediaCount, heroCount, projectCount, partnerCount, snapshot] =
    await Promise.all([
      prisma.product.count(),
      prisma.productCategory.count(),
      prisma.mediaAsset.count(),
      prisma.heroSlide.count(),
      prisma.project.count(),
      prisma.technologyPartner.count(),
      prisma.publishedSnapshot.findUnique({ where: { key: SITE_SNAPSHOT_KEY } }),
    ]);

  const latestDraft = await prisma.product.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });

  return {
    productCount,
    categoryCount,
    mediaCount,
    heroCount,
    projectCount,
    partnerCount,
    publishedAt: snapshot?.publishedAt ?? null,
    hasUnpublishedChanges:
      !snapshot || (latestDraft?.updatedAt ? latestDraft.updatedAt > snapshot.publishedAt : false),
  };
}

export async function getProductEditorData(productId?: string) {
  await seedDraftContent();

  const [categories, mediaAssets, product] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    productId
      ? prisma.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            images: { orderBy: { sortOrder: "asc" } },
            downloads: { include: { media: true } },
          },
        })
      : null,
  ]);

  return { categories, mediaAssets, product };
}

export async function getHomeEditorData() {
  await seedDraftContent();

  const [heroSlides, featuredProjects, partners, contactSetting] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.featuredProject.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.technologyPartner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findUnique({ where: { key: "contact" } }),
  ]);

  return {
    heroSlides,
    featuredProjects,
    partners,
    contact: (contactSetting?.value as unknown as CmsContact) ?? defaultContact,
  };
}

export async function getAdminProducts() {
  await seedDraftContent();

  return prisma.product.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true, downloads: true },
  });
}

export async function getMediaUsageCount(mediaId: string) {
  const [images, downloads, hero, projects, partners] = await Promise.all([
    prisma.productImage.count({ where: { mediaId } }),
    prisma.productDownload.count({ where: { mediaId } }),
    prisma.heroSlide.count({ where: { mediaId } }),
    prisma.featuredProject.count({ where: { mediaId } }),
    prisma.technologyPartner.count({ where: { mediaId } }),
  ]);

  return images + downloads + hero + projects + partners;
}

export async function getAdminOrFallbackDashboard() {
  try {
    return { data: await getAdminDashboardData(), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Database is not reachable. Start Postgres and run Prisma migrations.",
    };
  }
}

export async function getAboutEditorData(): Promise<CmsAboutPage> {
  await seedDraftContent();
  const setting = await prisma.siteSetting.findUnique({ where: { key: "about_page" } });
  return (setting?.value as unknown as CmsAboutPage) ?? seedContent.aboutPage;
}

export async function getServicesEditorData(): Promise<CmsServicesPage> {
  await seedDraftContent();
  const setting = await prisma.siteSetting.findUnique({ where: { key: "services_page" } });
  return (setting?.value as unknown as CmsServicesPage) ?? seedContent.servicesPage;
}

export async function getContactPageEditorData(): Promise<CmsContactPage> {
  await seedDraftContent();
  const setting = await prisma.siteSetting.findUnique({ where: { key: "contact_page" } });
  return (setting?.value as unknown as CmsContactPage) ?? seedContent.contactPage;
}
