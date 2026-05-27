import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

// Map category slug → local product image
const categoryImageMap = {
  "pixel-lights":  "/lumencraft/product-pixabar.jpg",
  "pixel-bars":    "/lumencraft/product-pixabar.jpg",
  "wall-washers":  "/lumencraft/product-linea-pro.jpg",
  "flood-lights":  "/lumencraft/product-drago-spot.jpg",
  "flex-linear":   "/lumencraft/product-linea-pro.jpg",
  "dmx-controls":  "/lumencraft/product-beam-pro.jpg",
};

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true },
  });

  console.log(`Found ${products.length} products`);
  let updated = 0;

  for (const product of products) {
    const img = categoryImageMap[product.category.slug];
    if (!img) {
      console.log(`  SKIP ${product.name} — no mapping for category "${product.category.slug}"`);
      continue;
    }

    // Only update if using Unsplash URL (wrong) or empty
    const hasWrongImage = product.images.length === 0 ||
      product.images.every(i => !i.url || i.url.includes("unsplash"));

    if (!hasWrongImage) {
      console.log(`  SKIP ${product.name} — already has local image`);
      continue;
    }

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, url: img, alt: product.name, sortOrder: 0 },
    });
    console.log(`  ✓ ${product.name} → ${img}`);
    updated++;
  }

  console.log(`\nUpdated ${updated} products`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
