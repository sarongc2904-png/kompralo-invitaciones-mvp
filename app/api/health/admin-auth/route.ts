import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@kompralo.com.mx" },
    select: {
      email: true,
      role: true,
      passwordHash: true
    }
  });

  if (!admin) {
    return NextResponse.json({
      ok: false,
      adminFound: false
    });
  }

  return NextResponse.json({
    ok: true,
    adminFound: true,
    role: admin.role,
    hashLength: admin.passwordHash.length,
    startsWithBcrypt: admin.passwordHash.startsWith("$2b$"),
    matchesAdmin123: await bcrypt.compare("Admin123!", admin.passwordHash)
  });
}
