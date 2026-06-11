import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api";

const guestSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  seats: z.coerce.number().min(1).default(1),
  status: z.enum(["PENDING", "CONFIRMED", "DECLINED"]).default("PENDING")
});

async function canAccess(eventId: string, userId: string, role: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  return Boolean(event && (role === "ADMIN" || event.ownerId === userId));
}

export async function GET(request: Request) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId || !(await canAccess(eventId, guard.session.user.id, guard.session.user.role))) {
    return NextResponse.json({ error: "Evento no autorizado." }, { status: 403 });
  }

  const guests = await prisma.guest.findMany({ where: { eventId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ guests });
}

export async function POST(request: Request) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = guestSchema.safeParse(body);

  if (!parsed.success || !(await canAccess(parsed.data.eventId, guard.session.user.id, guard.session.user.role))) {
    return NextResponse.json({ error: "Datos inválidos o evento no autorizado." }, { status: 400 });
  }

  const guest = await prisma.guest.create({ data: parsed.data });
  return NextResponse.json({ guest }, { status: 201 });
}
