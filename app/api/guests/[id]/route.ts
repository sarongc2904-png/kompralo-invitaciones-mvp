import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api";

type Params = {
  params: Promise<{ id: string }>;
};

const guestSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  seats: z.coerce.number().min(1).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "DECLINED"]).optional()
});

async function canAccessGuest(guestId: string, userId: string, role: string) {
  const guest = await prisma.guest.findUnique({ where: { id: guestId }, include: { event: true } });
  return guest && (role === "ADMIN" || guest.event.ownerId === userId) ? guest : null;
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  const guest = await canAccessGuest(id, guard.session.user.id, guard.session.user.role);

  if (!guest) {
    return NextResponse.json({ error: "Invitado no encontrado." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = guestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const updated = await prisma.guest.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ guest: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  const guest = await canAccessGuest(id, guard.session.user.id, guard.session.user.role);

  if (!guest) {
    return NextResponse.json({ error: "Invitado no encontrado." }, { status: 404 });
  }

  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
