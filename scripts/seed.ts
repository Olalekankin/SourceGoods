/**
 * Seed script — populates categories and sample products.
 * Run: pnpm --filter @workspace/scripts run seed
 * Uses ON CONFLICT DO NOTHING so it is safe to re-run.
 */
// Ensure DATABASE_URL is set for the seed run (provided by user)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_6zSiEX9FBgRr@ep-square-cloud-atqjj9w6-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const CATEGORIES = [
  { name: "Apparel & Accessories", slug: "apparel-accessories", description: "Clothing, bags, and fashion accessories" },
  { name: "Automotive", slug: "automotive", description: "Car accessories and parts" },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Skincare, haircare, and wellness" },
  { name: "Consumer Electronics", slug: "consumer-electronics", description: "Gadgets, phones, and smart devices" },
  { name: "Health & Wellness", slug: "health-wellness", description: "Supplements, medical, and fitness" },
  { name: "Home & Garden", slug: "home-garden", description: "Furniture, décor, and outdoor living" },
  { name: "Jewelry & Watches", slug: "jewelry-watches", description: "Fine jewelry and timepieces" },
  { name: "Kitchen & Dining", slug: "kitchen-dining", description: "Cookware, appliances, and tableware" },
  { name: "Luggage & Bags", slug: "luggage-bags", description: "Travel bags, backpacks, and more" },
  { name: "Office & School Supplies", slug: "office-school", description: "Stationery, furniture, and tools" },
  { name: "Sports & Entertainment", slug: "sports-entertainment", description: "Fitness equipment and leisure gear" },
  { name: "Toys & Games", slug: "toys-games", description: "For kids of all ages" },
];

const PRODUCTS = [
  {
    name: "Premium Bamboo Kitchen Set",
    slug: "premium-bamboo-kitchen-set",
    description: "Eco-friendly 12-piece bamboo kitchen utensil set with holder. Sustainable and durable.",
    category: "Kitchen & Dining",
    brand: "EcoHome",
    basePrice: "29.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 50,
    currentPreOrderCount: 34,
    estimatedShipDate: "2025-10-15",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "material", label: "Material", type: "text", value: "Bamboo" }],
    variants: [],
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description: "40-hour battery life, premium sound with active noise cancellation. Pre-order now.",
    category: "Consumer Electronics",
    brand: "SoundWave",
    basePrice: "89.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 100,
    currentPreOrderCount: 67,
    estimatedShipDate: "2025-11-01",
    fulfillmentStatus: "sourcing" as const,
    attributes: [{ key: "color", label: "Color", type: "select", value: "Midnight Black" }],
    variants: [],
  },
  {
    name: "Linen Duvet Cover Set",
    slug: "linen-duvet-cover-set",
    description: "100% French linen duvet cover with 2 pillowcases. Stonewashed for extra softness.",
    category: "Home & Garden",
    brand: "LuxeLinen",
    basePrice: "74.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 30,
    currentPreOrderCount: 22,
    estimatedShipDate: "2025-09-30",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "size", label: "Size", type: "select", value: "Queen" }],
    variants: [],
  },
  {
    name: "Stainless Steel Water Bottle",
    slug: "stainless-steel-water-bottle",
    description: "Double-wall insulated 32oz bottle. Keeps drinks cold 24h, hot 12h.",
    category: "Health & Wellness",
    brand: "HydroKeep",
    basePrice: "24.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: false,
    moq: null,
    currentPreOrderCount: 0,
    estimatedShipDate: null,
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "color", label: "Color", type: "select", value: "Ocean Blue" }],
    variants: [],
  },
  {
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    description: "Genuine full-grain leather, 20L capacity, laptop sleeve up to 15\".",
    category: "Luggage & Bags",
    brand: "UrbanCarry",
    basePrice: "149.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 25,
    currentPreOrderCount: 18,
    estimatedShipDate: "2025-10-20",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "color", label: "Color", type: "select", value: "Tan" }],
    variants: [],
  },
  {
    name: "Smart Home Air Purifier",
    slug: "smart-home-air-purifier",
    description: "HEPA H13 filter, covers 500sqft, Wi-Fi enabled with app control.",
    category: "Home & Garden",
    brand: "CleanAir Pro",
    basePrice: "129.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 75,
    currentPreOrderCount: 51,
    estimatedShipDate: "2025-11-15",
    fulfillmentStatus: "sourcing" as const,
    attributes: [{ key: "coverage", label: "Coverage", type: "text", value: "500 sq ft" }],
    variants: [],
  },
  {
    name: "Adjustable Dumbbell Set",
    slug: "adjustable-dumbbell-set",
    description: "5-50 lbs per dumbbell, quick-change dial system. Replaces 15 pairs.",
    category: "Sports & Entertainment",
    brand: "IronFlex",
    basePrice: "249.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 20,
    currentPreOrderCount: 14,
    estimatedShipDate: "2025-10-01",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "max_weight", label: "Max Weight", type: "text", value: "50 lbs each" }],
    variants: [],
  },
  {
    name: "Ceramic Matte Mug Set",
    slug: "ceramic-matte-mug-set",
    description: "Set of 4 handcrafted ceramic mugs, 14oz, microwave and dishwasher safe.",
    category: "Kitchen & Dining",
    brand: "ClayWorks",
    basePrice: "39.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 40,
    currentPreOrderCount: 29,
    estimatedShipDate: "2025-09-15",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "color", label: "Color", type: "select", value: "Sage Green" }],
    variants: [],
  },
  {
    name: "Merino Wool Running Socks",
    slug: "merino-wool-running-socks",
    description: "Anti-blister, temperature-regulating merino wool. Pack of 3 pairs.",
    category: "Apparel & Accessories",
    brand: "WoolRun",
    basePrice: "34.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: false,
    moq: null,
    currentPreOrderCount: 0,
    estimatedShipDate: null,
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "size", label: "Size", type: "select", value: "M/L" }],
    variants: [],
  },
  {
    name: "Portable LED Ring Light",
    slug: "portable-led-ring-light",
    description: "10\" ring light, 3 color temps, 10 brightness levels, phone holder included.",
    category: "Consumer Electronics",
    brand: "LumaPro",
    basePrice: "44.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 60,
    currentPreOrderCount: 43,
    estimatedShipDate: "2025-10-10",
    fulfillmentStatus: "sourcing" as const,
    attributes: [{ key: "size", label: "Size", type: "text", value: "10 inch" }],
    variants: [],
  },
  {
    name: "Yoga Mat with Alignment Lines",
    slug: "yoga-mat-alignment-lines",
    description: "6mm thick non-slip TPE mat with body alignment guides. Includes carry strap.",
    category: "Sports & Entertainment",
    brand: "ZenFlow",
    basePrice: "49.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: false,
    moq: null,
    currentPreOrderCount: 0,
    estimatedShipDate: null,
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "color", label: "Color", type: "select", value: "Midnight Purple" }],
    variants: [],
  },
  {
    name: "Solid Walnut Desk Organizer",
    slug: "solid-walnut-desk-organizer",
    description: "Handcrafted from solid walnut, 5 compartments, pen holder, and phone stand.",
    category: "Office & School Supplies",
    brand: "WoodCraft Studio",
    basePrice: "64.99",
    currency: "USD",
    primaryImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [],
    status: "published" as const,
    isPreOrder: true,
    moq: 15,
    currentPreOrderCount: 9,
    estimatedShipDate: "2025-11-01",
    fulfillmentStatus: "pending" as const,
    attributes: [{ key: "material", label: "Material", type: "text", value: "Solid Walnut" }],
    variants: [],
  },
];

async function ensureTables(pool: any) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id text PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      description text,
      product_count integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id text PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      description text,
      category text NOT NULL,
      brand text,
      base_price numeric(10,2) NOT NULL DEFAULT 0,
      currency text NOT NULL DEFAULT 'USD',
      primary_image_url text,
      images jsonb NOT NULL DEFAULT '[]',
      status text NOT NULL DEFAULT 'draft',
      is_pre_order boolean NOT NULL DEFAULT false,
      moq integer,
      current_pre_order_count integer NOT NULL DEFAULT 0,
      estimated_ship_date date,
      fulfillment_status text NOT NULL DEFAULT 'pending',
      attributes jsonb NOT NULL DEFAULT '[]',
      variants jsonb NOT NULL DEFAULT '[]',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function seed() {
  const { pool } = await import("../packages/db/dist/index.js");

  if (!pool) {
    throw new Error("Database pool not initialized. Ensure DATABASE_URL is set correctly.");
  }

  await ensureTables(pool);

  console.log("Seeding categories...");
  for (const cat of CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (id, name, slug, description, product_count)
       VALUES ($1, $2, $3, $4, 0)
       ON CONFLICT (slug) DO NOTHING`,
      [crypto.randomUUID(), cat.name, cat.slug, cat.description]
    );
  }
  console.log(`  ${CATEGORIES.length} categories done`);

  console.log("Seeding products...");
  for (const p of PRODUCTS) {
    await pool.query(
      `INSERT INTO products (id, name, slug, description, category, brand, base_price, currency, primary_image_url, images, status, is_pre_order, moq, current_pre_order_count, estimated_ship_date, fulfillment_status, attributes, variants)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (slug) DO NOTHING`,
      [
        crypto.randomUUID(),
        p.name,
        p.slug,
        p.description,
        p.category,
        p.brand || null,
        p.basePrice || null,
        p.currency || 'USD',
        p.primaryImageUrl || null,
        JSON.stringify(p.images || []),
        p.status,
        p.isPreOrder,
        p.moq,
        p.currentPreOrderCount || 0,
        p.estimatedShipDate || null,
        p.fulfillmentStatus || 'pending',
        JSON.stringify(p.attributes || []),
        JSON.stringify(p.variants || []),
      ]
    );
  }
  console.log(`  ${PRODUCTS.length} products done`);

  console.log("Updating category product counts...");
  for (const cat of CATEGORIES) {
    await pool.query(`UPDATE categories SET product_count = (
      SELECT COUNT(*) FROM products WHERE category = $1
    ) WHERE slug = $2`, [cat.name, cat.slug]);
  }
  console.log("  Counts updated");

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
