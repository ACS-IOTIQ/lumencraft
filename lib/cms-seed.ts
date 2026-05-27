import type { CmsCategory, CmsProduct, CmsSiteContent } from "@/lib/cms-types";

const basicSpecs = [
  { label: "Operating Voltage", value: "DC 24V" },
  { label: "Max Power", value: "36W" },
  { label: "Colour", value: "W / RGB / RGBW" },
  { label: "Light Source", value: "SMD RGBW 4-in-1 LED" },
  { label: "Material", value: "Aluminum alloy / Tempered glass" },
  { label: "Weight", value: "1.4 kg (1m)" },
  { label: "Lifetime", value: "50,000 hours" },
  { label: "IP Rating", value: "IP66" },
  { label: "Application", value: "Outdoor / Facade" },
];

const technicalDetails = [
  { label: "Certificates", value: "CE, RoHS, FCC" },
  { label: "Mounting", value: "Surface / bracket / recessed" },
  { label: "Finishing", value: "Anodized + electrostatic powder coating" },
  { label: "Fasteners", value: "Stainless steel (AISI 304)" },
  { label: "Gasket", value: "Silicone" },
  { label: "Lens / Diffuser", value: "Tempered safety glass / PMMA optic" },
  { label: "Impact protection", value: "IK08" },
  { label: "Ingress protection", value: "IP66" },
  { label: "Insulation class", value: "Class III (SELV)" },
  { label: "LED module", value: "High-power LEDs on metal-core PCB" },
  { label: "Driver", value: "External constant-voltage 24V driver" },
  { label: "Surge protection", value: "4 / 4 kV" },
  { label: "Power factor", value: "> 0.95" },
  { label: "Through wiring", value: "Dual cable entry, IP-rated connectors" },
  { label: "Operating temperature", value: "-30C to +55C" },
  { label: "Cable", value: "0.5 m flexible cable, both ends" },
  { label: "CRI", value: "Ra >= 80 (white modes)" },
  { label: "Refresh rate", value: "17 kHz (flicker-free)" },
];

const installationMethods = [
  {
    id: "surface",
    title: "Surface Mount",
    description: "Direct attachment to wall using brackets and stainless screws.",
  },
  {
    id: "recessed",
    title: "Recessed",
    description: "Flush-mounted into a wall cavity for a concealed lighting effect.",
  },
  {
    id: "bracket",
    title: "Adjustable Bracket",
    description: "Tiltable mounting for grazing or wash-up lighting effects.",
  },
  {
    id: "pole",
    title: "Pole / Standoff",
    description: "Mounted on dedicated pole or standoff for landscape and bridge applications.",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
];

const categorySeeds = [
  {
    name: "Pixel Lights",
    slug: "pixel-lights",
    icon: "pixel",
    description:
      "Individual pixel-addressable LED fixtures for dynamic content playback and architectural accents.",
    products: [
      ["PIXAdot Mini", "Compact / RGBW", "3W / IP67", "pixadot-mini"],
      ["PIXAdot Pro", "Standard / RGBW", "6W / IP67", "pixadot-pro"],
      ["PIXAdot Max", "High Output / RGBW", "12W / IP68", "pixadot-max"],
      ["PIXAsphere 50", "Sphere / RGBW", "8W / IP67", "pixasphere-50"],
      ["PIXAsphere 100", "Sphere / RGBW", "15W / IP67", "pixasphere-100"],
      ["PIXAcube Mini", "Cube / RGB", "4W / IP66", "pixacube-mini"],
      ["PIXAcube Pro", "Cube / RGBW", "10W / IP67", "pixacube-pro"],
      ["PIXAdrop", "Pendant / RGBW", "6W / IP65", "pixadrop"],
      ["PIXAstar", "Star / RGB", "5W / IP65", "pixastar"],
      ["PIXAtube Slim", "Tube / RGBW", "12W / IP66", "pixatube-slim"],
      ["PIXAtube Pro", "Tube / RGBW", "24W / IP67", "pixatube-pro"],
      ["PIXAflood Mini", "Flood / RGBW", "18W / IP66", "pixaflood-mini"],
    ],
  },
  {
    name: "Pixel Bars",
    slug: "pixel-bars",
    icon: "pixelbar",
    description:
      "Linear pixel-addressable LED bars for dynamic video content and architectural accents.",
    products: [
      ["PixelBar 500", "Linear / RGBW", "18W / IP66", "pixelbar-500"],
      ["PixelBar 1000", "Linear / RGBW", "36W / IP66", "pixelbar-1000"],
      ["PixelBar Mini", "Compact / RGB", "12W / IP65", "pixelbar-mini"],
      ["PixelBar Pro", "Linear / RGBW", "48W / IP67", "pixelbar-pro"],
      ["PixelBar Max", "High Output / RGBW", "72W / IP67", "pixelbar-max"],
      ["PixelBar Tube", "Tube / RGBW", "24W / IP66", "pixelbar-tube"],
      ["PixelBar Slim", "Ultra Slim / RGB", "15W / IP65", "pixelbar-slim"],
      ["PixelBar Outdoor", "Weatherproof / RGBW", "40W / IP68", "pixelbar-outdoor"],
      ["PixelBar Studio", "Indoor / RGBW", "30W / IP20", "pixelbar-studio"],
    ],
  },
  {
    name: "Wall Washers",
    slug: "wall-washers",
    icon: "washer",
    description:
      "Linear and compact wall-washing fixtures for uniform facade illumination.",
    products: [
      ["LINEA Pro", "Linear / RGBW", "15-36W / IP66", "linea-pro"],
      ["LINEA Slim", "Linear / RGB", "9-14W / IP65", "linea-slim"],
      ["LINEA Max", "Linear / RGBW", "48-60W / IP66", "linea-max"],
      ["WashGrid 12", "Compact / RGBW", "12W / IP67", "washgrid-12"],
      ["WashGrid 24", "Compact / RGBW", "24W / IP67", "washgrid-24"],
      ["LINEA Bend", "Curvable / RGB", "12W/m / IP66", "linea-bend"],
      ["ColorWash Pro", "High Output / RGBW", "90W / IP66", "colorwash-pro"],
      ["WashLine TW", "Linear / Tunable White", "18-28W / IP65", "washline-tw"],
      ["LINEA Mini", "Compact Linear / RGB", "6W / IP65", "linea-mini"],
      ["WashBeam 30", "Asymmetric / RGBW", "30W / IP66", "washbeam-30"],
      ["LINEA Heavy", "Heavy Duty / RGBW", "100W / IP67", "linea-heavy"],
      ["WashGrid Pro", "Compact / RGBW", "36W / IP67", "washgrid-pro"],
    ],
  },
  {
    name: "Flood Lights",
    slug: "flood-lights",
    icon: "flood",
    description:
      "High-output flood projectors for monuments, bridges, stadiums, and facade wash applications.",
    products: [
      ["FloodPro 50", "Compact / RGBW", "50W / IP66", "floodpro-50"],
      ["FloodPro 100", "Standard / RGBW", "100W / IP66", "floodpro-100"],
      ["FloodPro 200", "High Output / RGBW", "200W / IP67", "floodpro-200"],
      ["FloodMax 300", "Ultra High / RGBW", "300W / IP67", "floodmax-300"],
      ["FloodBeam Narrow", "Narrow Beam / RGBW", "150W / IP66", "floodbeam-narrow"],
      ["FloodBeam Wide", "Wide Beam / RGBW", "120W / IP66", "floodbeam-wide"],
      ["FloodColor Mini", "Compact / RGB", "30W / IP65", "floodcolor-mini"],
      ["FloodTune White", "Tunable White", "80W / IP66", "floodtune-white"],
    ],
  },
  {
    name: "Flex Linear",
    slug: "flex-linear",
    icon: "flex",
    description:
      "Flexible LED strips and tubes for curved surfaces, custom shapes, and architectural contours.",
    products: [
      ["FlexLine RGB", "Flexible / RGB", "10W/m / IP65", "flexline-rgb"],
      ["FlexLine RGBW", "Flexible / RGBW", "12W/m / IP65", "flexline-rgbw"],
      ["FlexLine Pro", "High Density / RGBW", "18W/m / IP67", "flexline-pro"],
      ["FlexTube Mini", "Tube / RGB", "8W/m / IP66", "flextube-mini"],
      ["FlexTube Pro", "Tube / RGBW", "15W/m / IP67", "flextube-pro"],
      ["FlexNeon Slim", "Neon Style / RGB", "6W/m / IP65", "flexneon-slim"],
      ["FlexNeon Pro", "Neon Style / RGBW", "12W/m / IP67", "flexneon-pro"],
    ],
  },
  {
    name: "DMX Controls",
    slug: "dmx-controls",
    icon: "controller",
    description:
      "Professional DMX512, Art-Net, and sACN infrastructure for lighting installations.",
    products: [
      ["DMX Gateway 4", "4 Universe / Ethernet", "Art-Net / sACN", "dmx-gateway-4"],
      ["DMX Gateway 8", "8 Universe / Ethernet", "Art-Net / sACN", "dmx-gateway-8"],
      ["DMX Splitter Pro", "1 to 8 / Optical", "RDM Support", "dmx-splitter-pro"],
      ["Wireless DMX TX", "Transmitter / 2.4GHz", "500m Range", "wireless-dmx-tx"],
      ["Wireless DMX RX", "Receiver / 2.4GHz", "500m Range", "wireless-dmx-rx"],
      ["DMX Recorder Pro", "Standalone / SD Card", "8 Universes", "dmx-recorder-pro"],
      ["DMX Power Supply", "24V DC / 300W", "IP67", "dmx-power-supply"],
      ["DMX Tester Mini", "Handheld / OLED", "RDM Compatible", "dmx-tester-mini"],
      ["Art-Net Node Pro", "4 Universe / PoE", "Ethernet", "artnet-node-pro"],
      ["DMX Merger 2x1", "Backup / HTP", "Failover", "dmx-merger-2x1"],
    ],
  },
];

function modelPrefix(slug: string) {
  return slug
    .split("-")
    .map((part) => part.slice(0, 2).toUpperCase())
    .join("");
}

function createProduct(
  category: { name: string; slug: string },
  item: string[],
  index: number,
): CmsProduct {
  const [name, family, spec, slug] = item;

  return {
    slug,
    name,
    categorySlug: category.slug,
    categoryName: category.name,
    categoryHref: `/products/${category.slug}`,
    series: category.slug === "dmx-controls" ? "Control Series" : "Commercial Series",
    family,
    shortDescription: `${family} - ${spec}`,
    description:
      `${name} is engineered for permanent architectural lighting projects that require reliable outdoor performance, precise control, and a clean professional finish. The fixture supports DMX-ready integration and is suitable for bridges, facades, public spaces, retail environments, and landmark installations.`,
    badges: ["CE", "RoHS", "IP65", "DMX512"],
    keyDetails: [
      { label: "Power", value: spec.split("/")[0].trim() },
      { label: "Colour", value: family },
      { label: "Control protocol", value: "DMX512 / Art-Net" },
      { label: "Beam angle", value: "Multiple options available" },
      { label: "Operating voltage", value: "DC 24V" },
      { label: "IP rating", value: spec.includes("IP") ? spec.split("/").pop()?.trim() ?? "IP65" : "IP65" },
    ],
    basicSpecs,
    technicalDetails,
    installationMethods,
    availableModels: [
      {
        model: `${modelPrefix(slug)}-STD-RGB`,
        length: "Standard",
        power: "Configurable",
        beam: "30 deg",
        output: "On request",
        colour: "RGB",
      },
      {
        model: `${modelPrefix(slug)}-PRO-RGBW`,
        length: "Standard",
        power: "Configurable",
        beam: "15 / 30 / 45 deg",
        output: "On request",
        colour: "RGBW",
      },
      {
        model: `${modelPrefix(slug)}-CUSTOM-TW`,
        length: "Custom",
        power: "Custom",
        beam: "Custom",
        output: "Spec on request",
        colour: "Tunable White",
      },
    ],
    images: galleryImages,
    downloads: [],
    isFeatured: index < 2,
    sortOrder: index,
  };
}

const categories: CmsCategory[] = categorySeeds.map((category, categoryIndex) => {
  const products = category.products.map((item, index) => createProduct(category, item, index));

  return {
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    description: category.description,
    sortOrder: categoryIndex,
    products,
  };
});

const products = categories.flatMap((category) => category.products);

export const fallbackSiteContent: CmsSiteContent = {
  categories,
  products,
  heroSlides: [
    {
      title: "Welcome to LumenCraft",
      eyebrow: "Programmable architectural lighting",
      copy: "Bringing landmarks to life with the power of cutting-edge DMX controlled architectural lighting.",
      image: "/lumencraft/hero-green-fit.jpg",
      align: "object-center",
    },
    {
      title: "Let's talk LIGHT",
      eyebrow: "Concept to commissioning",
      copy: "Dynamic light scenes, reliable controls, and on-site expertise for bridges, facades, malls, parks, and monuments.",
      image: "/lumencraft/hero-blue-fit.jpg",
      align: "object-center",
    },
    {
      title: "Illuminating Ideas, One Landmark at a Time",
      eyebrow: "Landmark-scale DMX systems",
      copy: "From concept to brilliance, experience the art of DMX-controlled architectural lighting with LumenCraft.",
      image: "/lumencraft/hero-landmark-fit.jpg",
      align: "object-center",
    },
  ],
  featuredProducts: [
    products.find((product) => product.slug === "linea-pro") ?? products[0],
    products.find((product) => product.slug === "pixelbar-1000") ?? products[1],
    products.find((product) => product.slug === "pixadot-mini") ?? products[2],
    products.find((product) => product.slug === "floodpro-100") ?? products[3],
  ],
  featuredProjects: [
    {
      id: "cable-structure",
      name: "DRAGO",
      location: "Cable Bridge, Hyderabad",
      image: "/lumencraft/project-cable-structure.jpg",
    },
    {
      id: "suspension",
      name: "DRAGO",
      location: "Cable Bridge, Hyderabad",
      image: "/lumencraft/project-suspension-bridge.jpg",
    },
    {
      id: "skywalk",
      name: "DRAGO",
      location: "Cable Bridge, Hyderabad",
      image: "/lumencraft/project-skywalk.jpg",
    },
    {
      id: "skywalk-alt",
      name: "DRAGO",
      location: "Cable Bridge, Hyderabad",
      image: "/lumencraft/project-skywalk-alt.jpg",
    },
  ],
  partners: [
    { name: "SWISSON", image: "/lumencraft/partner-swisson.jpg" },
    { name: "N+G", image: "/lumencraft/partner-nig.jpg" },
    { name: "MADRIX", image: "/lumencraft/partner-madrix.jpg" },
    { name: "PXM", image: "/lumencraft/partner-pxm.jpg" },
    { name: "Pharos", image: "/lumencraft/partner-pharos.jpg" },
    { name: "N+G", image: "/lumencraft/partner-nig.jpg" },
  ],
  contact: {
    eyebrow: "Let's Connect",
    headlines: [
      "Get in touch. Let's work together and create something remarkable!",
      "Got a specific project in mind?",
    ],
    email: "info@lumencraft.co.in",
    phone: "+91 7675875872",
    background: "diagonal",
  },
};
