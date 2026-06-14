const { PrismaClient } = require("@prisma/client");

process.env.DATABASE_URL =
  "mysql://root:QonMPfQsXAYlmmbjoExQXcyIdYXcsYHs@thomas.proxy.rlwy.net:19773/railway";

const prisma = new PrismaClient();

prisma
  .$queryRawUnsafe(
    "SELECT slug, nombre1, nombre2, fecha, modules, musicaUrl FROM WeddingInvitation LIMIT 5"
  )
  .then((rows) => {
    console.log(JSON.stringify(rows, null, 2));
  })
  .catch((e) => {
    console.error(e.message);
  })
  .finally(() => prisma.$disconnect());
