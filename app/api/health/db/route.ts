import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const admin = await prisma.user.findUnique({
      where: { email: "admin@kompralo.com.mx" },
      select: { email: true, role: true }
    });

    return NextResponse.json({
      ok: true,
      database: "connected",
      adminFound: Boolean(admin),
      adminRole: admin?.role ?? null
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message
      },
      { status: 500 }
    );
  }
}
