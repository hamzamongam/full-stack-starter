import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding products...')

  // Create a category for the products
  const category = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: {
      name: 'General',
      slug: 'general',
    },
  })

  // Create 10 products
  let createdCount = 0;
  for (let i = 0; i < 10; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i + 1} - ${Math.random().toString(36).substring(7)}`,
        slug: `product-${i + 1}-${Math.random().toString(36).substring(7)}`,
        description: `This is a generated description for Product ${i + 1}. It has some amazing features.`,
        shortDescription: `Short description for Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10, // random price between 10 and 110
        compareAtPrice: Math.floor(Math.random() * 50) + 120, // random compare at price
        sku: `SKU-${Date.now()}-${i}`,
        barcode: `BC-${Date.now()}-${i}`,
        trackInventory: true,
        quantity: Math.floor(Math.random() * 50) + 1,
        status: 'ACTIVE',
        categoryId: category.id,
      },
    })
    createdCount++;
  }

  console.log(`✅ Created ${createdCount} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
