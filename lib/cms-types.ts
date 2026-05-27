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

export type CmsSiteContent = {
  categories: CmsCategory[];
  products: CmsProduct[];
  heroSlides: CmsHeroSlide[];
  featuredProducts: CmsProduct[];
  featuredProjects: CmsFeaturedProject[];
  partners: CmsPartner[];
  contact: CmsContact;
};
