import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin, requireApiUser } from "@/lib/api";

const templateSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(5),
  previewUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true)
});

export async function GET() {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const guard = await requireApiAdmin();

  if ("error" in guard) {
    return guard.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const template = await prisma.template.create({ data: parsed.data });
  return NextResponse.json({ template }, { status: 201 });
}
