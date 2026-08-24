/**
 * Seeds demo products and a demo admin for local exploration.
 *
 * Usage (from backend/):
 *   npm run seed
 *   npm run seed -- --reset   # drop all products, then insert 10 again
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { connectDatabase } = require("../src/config/db");
const Product = require("../src/modules/product/product.model");
const Admin = require("../src/modules/auth/auth.model");

const DEMO_ADMIN_EMAIL = "admin@apnidukan.demo";
const DEMO_ADMIN_PASSWORD = "Admin@123";

const DEMO_PRODUCTS = [
  {
    name: "Basmati Rice 5 kg",
    price: 749,
    description:
      "Aged basmati with long grains and a nutty aroma. Ideal for biryanis, pulao, and everyday meals.",
    category: "Groceries",
    images: ["https://picsum.photos/seed/apnidukan-rice/800/600"],
  },
  {
    name: "Cold-Pressed Groundnut Oil 1 L",
    price: 289,
    description:
      "Wood-pressed peanut oil suited for sautéing and Indian cooking with a balanced flavour.",
    category: "Groceries",
    images: ["https://picsum.photos/seed/apnidukan-oil/800/600"],
  },
  {
    name: "Stainless Steel Cookware Set (3 pcs)",
    price: 1899,
    description:
      "Tri-ply bottoms for even heating. Compatible with induction and gas. Dishwasher-safe handles.",
    category: "Kitchen",
    images: ["https://picsum.photos/seed/apnidukan-kitchenset/800/600"],
  },
  {
    name: "Organic Turmeric Powder 200 g",
    price: 119,
    description:
      "Sourced transparently from partner farms; great colour and earthy flavour for dal and gravies.",
    category: "Spices",
    images: ["https://picsum.photos/seed/apnidukan-turmeric/800/600"],
  },
  {
    name: "Men's Slim Fit Casual Shirt",
    price: 999,
    description:
      "Breathable cotton blend in a matte finish; office-to-outing casual staples with durable stitching.",
    category: "Fashion",
    images: ["https://picsum.photos/seed/apnidukan-shirt/800/600"],
  },
  {
    name: "Wireless Earbuds Pro",
    price: 3499,
    description:
      "ANC, low-latency mode for video, USB-C charging case, sweat resistance for gym use.",
    category: "Electronics",
    images: ["https://picsum.photos/seed/apnidukan-earbuds/800/600"],
  },
  {
    name: "LED Desk Lamp with Rechargeable Battery",
    price: 1299,
    description:
      "Three colour temperatures, dimmer memory, and flexible arm for study or WFH setups.",
    category: "Home",
    images: ["https://picsum.photos/seed/apnidukan-lamp/800/600"],
  },
  {
    name: "Handwoven Cotton Throw (120x150 cm)",
    price: 1599,
    description:
      "Soft open-weave cotton for sofas and beds; pre-washed to reduce shrinkage on first wash.",
    category: "Home",
    images: ["https://picsum.photos/seed/apnidukan-throw/800/600"],
  },
  {
    name: "Kids School Backpack (18 L)",
    price: 899,
    description:
      "Padded straps, rain cover pocket, dividers for books and a water bottle holder.",
    category: "Kids",
    images: ["https://picsum.photos/seed/apnidukan-backpack/800/600"],
  },
  {
    name: "Stainless Steel Insulated Flask 750 ml",
    price: 649,
    description:
      "Vacuum insulated to keep chai hot for hours or water cold; matte finish exterior.",
    category: "Kitchen",
    images: ["https://picsum.photos/seed/apnidukan-flask/800/600"],
  },
];

async function seedDemoAdmin() {
  const existing = await Admin.findOne({ email: DEMO_ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.info(`Demo admin already exists (${DEMO_ADMIN_EMAIL}). Skip create.`);
    return;
  }
  const hashedPassword = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  await Admin.create({
    email: DEMO_ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });
  console.info(`Created demo admin  → ${DEMO_ADMIN_EMAIL} / ${DEMO_ADMIN_PASSWORD}`);
}

async function main() {
  const reset = process.argv.includes("--reset");

  await connectDatabase();

  await seedDemoAdmin();

  const count = await Product.countDocuments();

  if (count > 0 && !reset) {
    console.info(
      `Found ${count} product(s). No changes. Run "npm run seed -- --reset" to wipe products and insert 10 demo rows.`,
    );
    await mongoose.disconnect();
    return;
  }

  if (reset) {
    await Product.deleteMany({});
    console.info("Cleared existing products (--reset).");
  }

  await Product.insertMany(DEMO_PRODUCTS);
  console.info(`Inserted ${DEMO_PRODUCTS.length} demo products.`);

  await mongoose.disconnect();
  console.info("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exitCode = 1;
  mongoose.disconnect().catch(() => {});
});
