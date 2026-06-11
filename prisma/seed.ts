import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { templates } from "../data/templates";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@kompralo.com.mx" },
    update: {},
    create: {
      name: "Admin Kompralo",
      email: "admin@kompralo.com.mx",
      passwordHash: adminPassword,
      role: Role.ADMIN
    }
  });

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        category: template.category,
        description: template.palette,
        imageUrl: template.imageUrl,
        previewUrl: template.previewUrl
      },
      create: {
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.palette,
        imageUrl: template.imageUrl,
        previewUrl: template.previewUrl
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
