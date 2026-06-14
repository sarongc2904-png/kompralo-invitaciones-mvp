// Crea un usuario ADMIN de prueba en la base de datos activa.
// Uso: node scripts/create-admin.js
//
// Cambia EMAIL y PASSWORD antes de correr si quieres otros valores.

const EMAIL    = "admin@test.com"
const PASSWORD = "admin1234"
const NAME     = "Admin"

const { PrismaClient } = require("@prisma/client")
const bcrypt           = require("bcryptjs")

async function main() {
  const prisma = new PrismaClient()

  const existing = await prisma.user.findUnique({ where: { email: EMAIL } })
  if (existing) {
    console.log(`⚠️  Ya existe un usuario con email ${EMAIL} (id: ${existing.id})`)
    await prisma.$disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10)

  const user = await prisma.user.create({
    data: { name: NAME, email: EMAIL, passwordHash, role: "ADMIN" },
    select: { id: true, email: true, role: true },
  })

  console.log("✅ Admin creado:")
  console.log(`   Email   : ${user.email}`)
  console.log(`   Password: ${PASSWORD}`)
  console.log(`   Role    : ${user.role}`)
  console.log(`   ID      : ${user.id}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error("❌ Error:", err.message)
  process.exit(1)
})
