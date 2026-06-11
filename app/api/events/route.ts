import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/api";
import { uniqueSlug } from "@/lib/slug";

const eventSchema = z.object({
  templateId: z.string().optional().nullable(),
  title: z.string().min(2),
  type: z.string().min(2),
  honoree: z.string().min(2),
  eventDate: z.string().min(4),
  eventTime: z.string().min(3),
  venue: z.string().optional().nullable(),
  address: z.string().min(3),
  mapsUrl: z.string().optional().nullable(),
  musicUrl: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  giftTable: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT")
});

export async function GET() {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const where = guard.session.user.role === "ADMIN" ? {} : { ownerId: guard.session.user.id };
  const events = await prisma.event.findMany({
    where,
    include: { template: true, guests: true, rsvps: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const guard = await requireApiUser();

  if ("error" in guard) {
    return guard.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      ownerId: guard.session.user.id,
      slug: uniqueSlug(parsed.data.title),
      eventDate: new Date(parsed.data.eventDate),
      gallery: []
    }
  });

  return NextResponse.json({ event }, { status: 201 });
}
