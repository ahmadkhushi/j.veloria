// prisma/test-connection.js
// One-shot TiDB Cloud connection test — inserts a product and reads it back.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🔗 Connecting to TiDB Cloud (j-veloria-db)…");

  const product = await prisma.product.create({
    data: {
      name:        "Test Connection Product",
      slug:        "test-connection-product-" + Date.now(),
      description: "Inserted automatically to verify TiDB Cloud connectivity.",
      price:       0.01,
      brand:       "j.viloria",
      department:  "CLOTHES",
      isActive:    false,
      stock:       0,
    },
  });

  console.log("✅ Test product inserted successfully!");
  console.log("   ID   :", product.id);
  console.log("   Name :", product.name);
  console.log("   Slug :", product.slug);
  console.log("   Time :", product.createdAt);
  console.log("\n🎉 TiDB Cloud connection is fully operational.");
}

main()
  .catch((err) => {
    console.error("❌ Connection test failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
