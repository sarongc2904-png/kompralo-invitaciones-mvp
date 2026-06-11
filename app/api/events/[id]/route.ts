import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api";

type Params = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  templateId: z.string().optional().nullable(),
  title: z.string().min(2).optional(),
  type: z.string().min(2).optional(),
  honoree: z.string().min(2).optional(),
  eventDate: z.string().min(4).optional(),
  eventTime: z.string().min(3).optional(),
  venue: z.string().optional().nullable(),
  address: z.string().min(3).optional(),
  mapsUrl: z.string().optional().nullable(),
  musicUrl: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  giftTable: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
});

async function canAccessEvent(eventId: string, userId: string, role: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  return event && (role === "ADMIN" || event.ownerId === userId) ? event : null;
}

export async function GET(_: Request, { params }: Params) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  const event = await canAccessEvent(id, guard.session.user.id, guard.session.user.role);

  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  const event = await canAccessEvent(id, guard.session.user.id, guard.session.user.role);

  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    ...(parsed.data.eventDate ? { eventDate: new Date(parsed.data.eventDate) } : {})
  };

  const updated = await prisma.event.update({
    where: { id },
    data
  });

  return NextResponse.json({ event: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { id } = await params;
  const event = await canAccessEvent(id, guard.session.user.id, guard.session.user.role);

  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
