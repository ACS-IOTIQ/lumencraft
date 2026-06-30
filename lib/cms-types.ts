export type DetailRow = {
  label: string;
  value: string;
};

export type CmsProductModel = {
  model: string;
  length?: string;
  power?: string;
  beam?: string;
  output?: string;
  colour?: string;
};

export type CmsDownload = {
  id: string;
  type: "ies" | "datasheet" | string;
  label: string;
};

export type CmsProduct = {
  id?: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  categoryHref: string;
  series: string;
  family?: string;
  shortDescription?: string;
  description: string;
  badges: string[];
  keyDetails: DetailRow[];
  basicSpecs: DetailRow[];
  technicalDetails: DetailRow[];
  installationMethods: {
    id: string;
    title: string;
    description: string;
  }[];
  availableModels: CmsProductModel[];
  images: string[];
  downloads: CmsDownload[];
  isFeatured?: boolean;
  sortOrder?: number;
};

export type CmsCategory = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  products: CmsProduct[];
};

export type CmsHeroSlide = {
  title: string;
  eyebrow: string;
  copy: string;
  image: string;
  align: string;
};

export type CmsFeaturedProject = {
  id: string;
  name: string;
  location: string;
  image: string;
};

export type CmsPartner = {
  name: string;
  image: string;
};

export type CmsContact = {
  eyebrow: string;
  headlines: string[];
  email: string;
  phone: string;
  background: "diagonal";
};

export type CmsContactDetailItem = { text: string; href: string | null };

export type CmsContactDetail = {
  label: string;
  items: CmsContactDetailItem[];
};

export type CmsContactPage = {
  heroCopy: string;
  details: CmsContactDetail[];
  formHeading: string;
  formSubtext: string;
};

export type CmsBlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
};

export type CmsProjectCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type CmsProject = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  location: string;
  designer?: string;
  completionYear?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  featuredImage: string;
  galleryImages: string[];
  productsUsed: { slug: string; name: string }[];
  isFeatured?: boolean;
  sortOrder?: number;
};

export type CmsBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: Record<string, unknown>;
  coverImage?: string;
  author: string;
  tags: string[];
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  readingTime: number;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
};

export type CmsAboutStat = { value: string; label: string };

export type CmsAboutCapability = {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
};

export type CmsAboutPage = {
  brandQuote: string;
  brandSubtext: string;
  overviewParagraphs: string[];
  stats: CmsAboutStat[];
  capabilities: CmsAboutCapability[];
  visionStatement: string;
  ctaHeadline: string;
  ctaBody: string;
};

export type CmsServiceItem = {
  number: string;
  title: string;
  description: string;
};

export type CmsProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type CmsWhyItem = {
  label: string;
  description: string;
};

export type CmsServicesPage = {
  heroHeadline: string;
  heroCopy: string;
  services: CmsServiceItem[];
  process: CmsProcessStep[];
  whyItems: CmsWhyItem[];
  ctaHeadline: string;
  ctaBody: string;
};

export type CmsSiteContent = {
  categories: CmsCategory[];
  products: CmsProduct[];
  heroSlides: CmsHeroSlide[];
  featuredProducts: CmsProduct[];
  featuredProjects: CmsFeaturedProject[];
  partners: CmsPartner[];
  contact: CmsContact;
  blogCategories: CmsBlogCategory[];
  blogPosts: CmsBlogPost[];
  projects: CmsProject[];
  projectCategories: CmsProjectCategory[];
  aboutPage: CmsAboutPage;
  servicesPage: CmsServicesPage;
  contactPage: CmsContactPage;
};
