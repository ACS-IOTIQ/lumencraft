import type { CmsCategory, CmsProduct, CmsProject, CmsProjectCategory, CmsSiteContent } from "@/lib/cms-types";

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

const projectCategories: CmsProjectCategory[] = [
  { id: "infrastructure", name: "Infrastructure", slug: "infrastructure", sortOrder: 0 },
  { id: "commercial", name: "Commercial", slug: "commercial", sortOrder: 1 },
  { id: "hospitality", name: "Hospitality", slug: "hospitality", sortOrder: 2 },
  { id: "cultural", name: "Cultural", slug: "cultural", sortOrder: 3 },
  { id: "landscape", name: "Landscape", slug: "landscape", sortOrder: 4 },
];

const projectsList: CmsProject[] = [
  {
    id: "drago-cable-bridge",
    slug: "drago-cable-bridge",
    name: "DRAGO Cable Bridge",
    shortDescription:
      "A landmark cable-stayed pedestrian bridge illuminated with programmable RGBW pixel lighting across 320 metres.",
    description:
      "The DRAGO Cable Bridge project in Hyderabad involved the complete architectural lighting design and installation for a 320-metre cable-stayed pedestrian bridge. The brief called for a fully programmable, DMX-controlled lighting system that could deliver both functional illumination and dynamic colour-changing shows for special occasions.\n\nLumenCraft deployed a combination of PixelBar 1000 linear fixtures along the main span and PIXAdot Mini pixel nodes at the cable attachment points, creating a fully addressable system with over 1,200 individually controllable zones. The result is a bridge that can display animated lighting sequences, static architectural accents, or fade-to-warm white for everyday pedestrian use.",
    location: "Hyderabad, Telangana",
    designer: "AECOM Infrastructure",
    completionYear: "2023",
    categoryId: "infrastructure",
    categoryName: "Infrastructure",
    categorySlug: "infrastructure",
    featuredImage: "/lumencraft/project-cable-structure.jpg",
    galleryImages: [
      "/lumencraft/project-suspension-bridge.jpg",
      "/lumencraft/project-skywalk.jpg",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    ],
    productsUsed: [
      { slug: "pixelbar-1000", name: "PixelBar 1000" },
      { slug: "pixadot-mini", name: "PIXAdot Mini" },
      { slug: "floodpro-100", name: "FloodPro 100" },
    ],
    isFeatured: true,
    sortOrder: 0,
  },
  {
    id: "drago-skywalk",
    slug: "drago-skywalk",
    name: "DRAGO Skywalk Complex",
    shortDescription:
      "An elevated urban skywalk connecting six metro stations with continuous facade lighting and dynamic underbridge illumination.",
    description:
      "The DRAGO Skywalk Complex is a multi-level elevated pedestrian walkway connecting six metro stations across a 1.4-kilometre stretch in Hyderabad. Lumencraft was engaged to design and install the entire architectural lighting system.\n\nThe project required a unified lighting language that could operate across the full length while allowing zone-specific scenes. We deployed Linea Pro flex linear strips along the soffit edges and PixelBar 500 fixtures on the vertical facade panels. The complete system is controlled by a Pharos Designer controller with pre-programmed seasonal shows and a live-event mode.",
    location: "Hyderabad, Telangana",
    designer: "DMRC Infrastructure Ltd.",
    completionYear: "2023",
    categoryId: "infrastructure",
    categoryName: "Infrastructure",
    categorySlug: "infrastructure",
    featuredImage: "/lumencraft/project-skywalk.jpg",
    galleryImages: [
      "/lumencraft/project-skywalk-alt.jpg",
      "/lumencraft/project-cable-structure.jpg",
    ],
    productsUsed: [
      { slug: "linea-pro", name: "Linea Pro" },
      { slug: "pixelbar-500", name: "PixelBar 500" },
    ],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "grand-central-facade",
    slug: "grand-central-facade",
    name: "Grand Central Mall",
    shortDescription:
      "Full facade lighting for a six-storey premium retail destination with programmable colour-wash and storefront accent systems.",
    description:
      "Grand Central Mall is a 6-level premium retail destination in Mumbai. Lumencraft designed and executed the complete exterior lighting scheme including facade wash, colonnade accents, and entrance portal lighting.\n\nThe design intent was to create a warm, welcoming retail atmosphere while maintaining the ability to switch to vibrant promotional lighting for events and festivals. FloodPro 100 units handle the upper-floor facade wash while PixelBar Max fixtures run the colonnade animation system.",
    location: "Mumbai, Maharashtra",
    designer: "Hafeez Contractor Architects",
    completionYear: "2024",
    categoryId: "commercial",
    categoryName: "Commercial",
    categorySlug: "commercial",
    featuredImage: "/lumencraft/project-suspension-bridge.jpg",
    galleryImages: [
      "/lumencraft/project-cable-structure.jpg",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    ],
    productsUsed: [
      { slug: "floodpro-100", name: "FloodPro 100" },
      { slug: "pixelbar-max", name: "PixelBar Max" },
      { slug: "pixadot-pro", name: "PIXAdot Pro" },
    ],
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: "marriott-courtyard",
    slug: "marriott-courtyard",
    name: "Marriott Courtyard",
    shortDescription:
      "Elegant porte-cochère and facade illumination for a 280-key business hotel emphasising warmth and architectural depth.",
    description:
      "The Marriott Courtyard Bengaluru project involved the architectural lighting for the hotel exterior, porte-cochère canopy, and landscaped drop-off zone. The brief was clear: restrained, warm, hospitality-grade lighting that complements the building's stone and glass facade.\n\nLumencraft specified Linea Pro warm-white linear strips for the soffit and canopy reveals, supplemented by FloodPro 50 fixtures to pick out the textured stone columns. The full system runs on a scheduled programme with sunrise dimming and a late-night energy-saving profile.",
    location: "Bengaluru, Karnataka",
    designer: "KGD Architecture",
    completionYear: "2024",
    categoryId: "hospitality",
    categoryName: "Hospitality",
    categorySlug: "hospitality",
    featuredImage: "/lumencraft/project-skywalk-alt.jpg",
    galleryImages: [
      "/lumencraft/project-skywalk.jpg",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    ],
    productsUsed: [
      { slug: "linea-pro", name: "Linea Pro" },
      { slug: "floodpro-100", name: "FloodPro 100" },
    ],
    isFeatured: false,
    sortOrder: 3,
  },
  {
    id: "riverside-promenade",
    slug: "riverside-promenade",
    name: "Riverside Promenade",
    shortDescription:
      "A 2.4-kilometre riverfront walkway with landscape pixel lighting, bollard accents, and a programmable bridge arch system.",
    description:
      "The Surat Riverside Promenade project is a 2.4-kilometre urban riverfront development along the Tapi River. Lumencraft was appointed as the specialist lighting contractor for all architectural and landscape lighting elements.\n\nThe scope included 420 PixelBar 500 linear fixtures integrated into the balustrade profile, PIXAdot pixel nodes at the canopy structure nodes, and custom-designed bollard lighting using our Linea Pro modules. The entire riverside promenade operates as a single pixel-mapped canvas for the city's evening light shows.",
    location: "Surat, Gujarat",
    designer: "Surat Smart City SPV",
    completionYear: "2022",
    categoryId: "landscape",
    categoryName: "Landscape",
    categorySlug: "landscape",
    featuredImage: "/lumencraft/project-cable-structure.jpg",
    galleryImages: [
      "/lumencraft/project-suspension-bridge.jpg",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    ],
    productsUsed: [
      { slug: "pixelbar-500", name: "PixelBar 500" },
      { slug: "pixadot-mini", name: "PIXAdot Mini" },
      { slug: "linea-pro", name: "Linea Pro" },
    ],
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: "national-science-museum",
    slug: "national-science-museum",
    name: "National Science Museum",
    shortDescription:
      "Cultural facade lighting for a heritage-adjacent institution balancing conservation sensitivity with modern programmable effects.",
    description:
      "The National Science Museum, New Delhi required an architectural lighting refresh that respected the building's heritage-adjacent status while introducing modern programmable effects for evening events.\n\nLumencraft deployed a discreet system using PixelBar Slim fixtures concealed in the facade reveals, with PIXAsphere 50 units marking the roofline. All fixtures operate in a conservation-compliant warm-white mode by default, with a restricted-colour dynamic show activated only during special cultural events.",
    location: "New Delhi",
    designer: "CP Kukreja Architects",
    completionYear: "2023",
    categoryId: "cultural",
    categoryName: "Cultural",
    categorySlug: "cultural",
    featuredImage: "/lumencraft/project-suspension-bridge.jpg",
    galleryImages: [
      "/lumencraft/project-skywalk.jpg",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    ],
    productsUsed: [
      { slug: "pixelbar-slim", name: "PixelBar Slim" },
      { slug: "pixasphere-50", name: "PIXAsphere 50" },
    ],
    isFeatured: false,
    sortOrder: 5,
  },
  {
    id: "techpark-phase2",
    slug: "techpark-phase2",
    name: "Magarpatta Tech Park Phase II",
    shortDescription:
      "Corporate campus exterior lighting for a 1.2 million sq. ft. IT park with facade wash, podium accents, and wayfinding systems.",
    description:
      "Magarpatta Tech Park Phase II is a 1.2 million square foot IT campus development in Pune. Lumencraft designed and installed the architectural exterior lighting for all six towers and the interconnecting podium.\n\nThe scheme uses a restrained palette of cool white for everyday operation, with a programme-driven colour-accent mode for campus events. FloodPro 100 and FloodPro 50 units handle the tower facade wash, while PixelBar Pro linear fixtures define the podium-level colonnade.",
    location: "Pune, Maharashtra",
    designer: "RSP Design Consultants",
    completionYear: "2024",
    categoryId: "commercial",
    categoryName: "Commercial",
    categorySlug: "commercial",
    featuredImage: "/lumencraft/project-skywalk.jpg",
    galleryImages: [
      "/lumencraft/project-cable-structure.jpg",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    ],
    productsUsed: [
      { slug: "floodpro-100", name: "FloodPro 100" },
      { slug: "pixelbar-pro", name: "PixelBar Pro" },
    ],
    isFeatured: false,
    sortOrder: 6,
  },
  {
    id: "ecr-pedestrian-bridge",
    slug: "ecr-pedestrian-bridge",
    name: "ECR Pedestrian Bridge",
    shortDescription:
      "Dramatic pixel-addressable lighting for a signature pedestrian bridge on the East Coast Road corridor.",
    description:
      "The ECR Pedestrian Bridge Chennai is a signature crossing structure on the East Coast Road arterial corridor. Lumencraft was engaged to provide the complete architectural lighting system for the bridge structure.\n\nThe design celebrates the bridge's sweeping arch profile with PixelBar 1000 fixtures running the full length of the arch, supplemented by PIXAdot Max point lights at the arch crown. The system delivers a range of static and animated scenes, with a dedicated celebration mode for major city events.",
    location: "Chennai, Tamil Nadu",
    designer: "Chennai Metropolitan Development Authority",
    completionYear: "2024",
    categoryId: "infrastructure",
    categoryName: "Infrastructure",
    categorySlug: "infrastructure",
    featuredImage: "/lumencraft/project-skywalk-alt.jpg",
    galleryImages: [
      "/lumencraft/project-suspension-bridge.jpg",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    ],
    productsUsed: [
      { slug: "pixelbar-1000", name: "PixelBar 1000" },
      { slug: "pixadot-max", name: "PIXAdot Max" },
    ],
    isFeatured: false,
    sortOrder: 7,
  },
];

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
  blogCategories: [],
  blogPosts: [],
  projects: projectsList,
  projectCategories,
  aboutPage: {
    brandQuote: "Sculpting darkness, crafting light.",
    brandSubtext: "We illuminate architecture, breathing life into its beauty after dark.",
    overviewParagraphs: [
      "With over a decade of experience across the Middle East and India, Lumencraft stands as a specialist architectural lighting partner for landmark buildings, bridges, infrastructure, and public spaces. We bring together deep product expertise and on-site engineering capability to deliver lighting systems that perform reliably, night after night.",
      "At Lumencraft, we specialise in DMX-based programmable lighting systems — setting the standard for dynamic, sophisticated control at scale. Our comprehensive service covers every aspect of your lighting project: from initial design consultation and product specification, through to supply, system integration, and meticulous on-site programming.",
      "Whether you're envisioning a transformative facade treatment, an iconic bridge lighting scheme, or a fully animated building media facade — Lumencraft is your specialist partner. We combine a comprehensive product range with deep control-system expertise to bring your vision to light, on time and on specification.",
    ],
    stats: [
      { value: "12+", label: "Years of experience" },
      { value: "150+", label: "Projects completed" },
      { value: "200+", label: "Product SKUs" },
      { value: "India & ME", label: "Markets served" },
    ],
    capabilities: [
      {
        title: "Lighting Design Consultancy",
        description:
          "We work alongside architects, MEP consultants, and lighting designers to develop specifications that are architecturally appropriate, technically sound, and deliverable at landmark scale.",
        link: "/#contact",
        linkLabel: "Talk to our team",
      },
      {
        title: "DMX Product Supply",
        description:
          "Our own range of outdoor-rated pixel lights, linear fixtures, flood projectors, and DMX control systems — engineered for 24/7 outdoor operation across India's extreme climate conditions.",
        link: "/products",
        linkLabel: "Browse products",
      },
      {
        title: "Integration & Commissioning",
        description:
          "From cable infrastructure to controller programming, our field engineering teams handle complete DMX system buildout — and stay on-site until every scene, show, and schedule performs exactly as designed.",
        link: "/projects",
        linkLabel: "See our projects",
      },
    ],
    visionStatement:
      "To make programmable architectural lighting the standard for every landmark project in India and the Middle East — accessible, reliable, and extraordinary.",
    ctaHeadline: "To learn more about us",
    ctaBody: "Get in touch — we're always happy to talk about lighting, projects, and ideas.",
  },
  servicesPage: {
    heroHeadline: "End-to-end lighting services.",
    heroCopy:
      "From the first design sketch to final commissioning sign-off — Lumencraft owns the full scope so nothing falls through the cracks on your landmark project.",
    services: [
      {
        number: "01",
        title: "Lighting Design Consulting",
        description:
          "We work alongside architects, MEP consultants, and project managers to develop lighting specifications, photometric layouts, and product recommendations tailored to your architectural vision and project brief.",
      },
      {
        number: "02",
        title: "Lighting Programming",
        description:
          "Full show programming for DMX-controlled architectural lighting systems — static scenes, dynamic animations, scheduled daily shows, and live-event modes — using Pharos, Madrix, and PXM controllers.",
      },
      {
        number: "03",
        title: "Training & Workshops",
        description:
          "Hands-on training for architects, electrical contractors, and facility managers. Topics include DMX fundamentals, controller operation, show file editing, fault diagnosis, and routine maintenance procedures.",
      },
      {
        number: "04",
        title: "System Integration",
        description:
          "End-to-end installation coordination and system commissioning — cable infrastructure, controller and dimmer rack installation, network configuration, system testing, and final scene sign-off with the client.",
      },
      {
        number: "05",
        title: "Maintenance & Support",
        description:
          "Annual maintenance contracts, rapid field-response support, spare parts supply, and remote diagnostics for commissioned Lumencraft systems and third-party DMX installations across India and the Middle East.",
      },
      {
        number: "06",
        title: "Project Management",
        description:
          "Single-point accountability from design brief to handover — coordinating product lead times, contractor interfaces, regulatory sign-offs, site attendance, and as-built documentation for complex landmark projects.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Brief",
        description:
          "We understand your project vision, constraints, and requirements — site, scale, timeline, and budget.",
      },
      {
        step: "02",
        title: "Specify",
        description:
          "We recommend the right products, layout, control strategy, and programming approach for your application.",
      },
      {
        step: "03",
        title: "Execute",
        description:
          "We supply, integrate, and program the complete system — managing the full scope on your behalf.",
      },
      {
        step: "04",
        title: "Commission",
        description:
          "We deliver a fully tested, documented, and operational installation — and stay available for ongoing support.",
      },
    ],
    whyItems: [
      {
        label: "Specialist focus",
        description:
          "We only do architectural and facade lighting — no diluted generalism, no compromised attention.",
      },
      {
        label: "Own product range",
        description:
          "We supply our own fixtures so we control quality, lead times, and long-term spare parts availability.",
      },
      {
        label: "Field engineering",
        description:
          "Our team is on-site at commissioning. We don't hand over to an unfamiliar subcontractor at the critical stage.",
      },
    ],
    ctaHeadline: "We'd love to help!",
    ctaBody:
      "Tell us about your project and we'll put together the right team and service mix for you.",
  },
  contactPage: {
    heroCopy:
      "Whether you have a project brief, a product question, or are interested in distribution partnerships — we'd love to hear from you.",
    details: [
      {
        label: "Call us on",
        items: [{ text: "+91 7675875872", href: "tel:+917675875872" }],
      },
      {
        label: "Write to us on",
        items: [{ text: "info@lumencraft.co.in", href: "mailto:info@lumencraft.co.in" }],
      },
      {
        label: "Registered Address",
        items: [
          { text: "Plot 42, Phase II, IDA Cherlapally", href: null },
          { text: "Hyderabad — 500 051", href: null },
          { text: "Telangana, India", href: null },
        ],
      },
      {
        label: "For Distribution enquiries write to us at",
        items: [{ text: "distribution@lumencraft.co.in", href: "mailto:distribution@lumencraft.co.in" }],
      },
    ],
    formHeading: "Tell us about your project",
    formSubtext: "We typically respond within one business day.",
  },
};
