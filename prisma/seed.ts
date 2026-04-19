import { PrismaClient } from "@prisma/client";
import { TOPICS } from "../lib/topics-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding topics...");

  for (const topic of TOPICS) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: {
        slug: topic.slug,
        category: topic.category,
        order: topic.order,
        titleRu: topic.titleRu,
        titleEn: topic.titleEn,
        descRu: topic.descRu,
        descEn: topic.descEn,
      },
      update: {
        category: topic.category,
        order: topic.order,
        titleRu: topic.titleRu,
        titleEn: topic.titleEn,
        descRu: topic.descRu,
        descEn: topic.descEn,
      },
    });
  }

  console.log(`Seeded ${TOPICS.length} topics.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
