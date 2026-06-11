import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/api";

type Params = {
  params: Promise<{ id: string }>;
};

const templateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(5).optional(),
  previewUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireApiAdmin();

  if ("error" in guard) {
    return guard.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { id } = await params;
  const template = await prisma.template.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ template });
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await requireApiAdmin();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
