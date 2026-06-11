import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

const adminPasswordHash = "$2b$10$VJNtMWQRX4Gl/HFa3tt2G.zYFThUqFSl9vwnA5f.y3dfKf1EBihXa";

const publicEventSchema = z.object({
  nombre: z.string().min(2),
  whatsapp: z.string().min(8),
  correo: z.string().email(),
  tipoEvento: z.string().min(2),
  festejado: z.string().min(2),
  fecha: z.string().min(4),
  hora: z.string().min(3),
  direccion: z.string().min(3),
  googleMaps: z.string().optional().nullable(),
  musica: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  mesaRegalos: z.string().optional().nullable(),
  comentarios: z.string().optional().nullable(),
  plan: z.string().optional().nullable(),
  modelo: z.string().optional().nullable(),
  paymentSessionId: z.string().optional().nullable(),
  photos: z.array(z.object({
    name: z.string(),
    size: z.number(),
    type: z.string()
  })).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = publicEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los campos obligatorios." }, { status: 400 });
  }

  const data = parsed.data;
  const title = `${data.tipoEvento} de ${data.festejado}`;

  const owner = await prisma.user.upsert({
    where: { email: "admin@kompralo.com.mx" },
    update: { role: "ADMIN" },
    create: {
      id: "admin-user",
      name: "Admin Kompralo",
      email: "admin@kompralo.com.mx",
      passwordHash: adminPasswordHash,
      role: "ADMIN"
    }
  });

  const template = await prisma.template.findFirst({
    where: {
      isActive: true,
      OR: [
        { category: data.tipoEvento },
        { previewUrl: data.modelo ?? undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  const notes = [
    `Cliente: ${data.nombre}`,
    `WhatsApp: ${data.whatsapp}`,
    `Correo: ${data.correo}`,
    data.plan ? `Plan: ${data.plan}` : null,
    data.paymentSessionId ? `Pago Stripe: ${data.paymentSessionId}` : null,
    data.comentarios ? `Comentarios: ${data.comentarios}` : null,
    data.photos?.length ? `Fotografías: ${data.photos.map((photo) => photo.name).join(", ")}` : null
  ].filter(Boolean).join("\n");

  const event = await prisma.event.create({
    data: {
      ownerId: owner.id,
      templateId: template?.id ?? null,
      slug: uniqueSlug(title),
      title,
      type: data.tipoEvento,
      honoree: data.festejado,
      eventDate: new Date(`${data.fecha}T00:00:00`),
      eventTime: data.hora,
      venue: data.direccion,
      address: data.direccion,
      mapsUrl: data.googleMaps || null,
      musicUrl: data.musica || null,
      dressCode: data.dressCode || null,
      giftTable: data.mesaRegalos || null,
      notes,
      heroImage: template?.imageUrl ?? null,
      gallery: data.photos ?? [],
      status: "PUBLISHED"
    }
  });

  return NextResponse.json({
    event,
    publicUrl: `/i/${event.slug}`
  }, { status: 201 });
}
