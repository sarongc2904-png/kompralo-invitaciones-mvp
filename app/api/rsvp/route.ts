import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const rsvpSchema = z.object({
  eventId: z.string().min(1),
  guestId: z.string().optional().nullable(),
  name: z.string().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.enum(["CONFIRMED", "DECLINED"]),
  message: z.string().optional().nullable()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const rsvp = await prisma.rsvp.create({ data: parsed.data });

  if (parsed.data.guestId) {
    await prisma.guest.update({
      where: { id: parsed.data.guestId },
      data: { status: parsed.data.status }
    });
  }

  return NextResponse.json({ rsvp }, { status: 201 });
}
