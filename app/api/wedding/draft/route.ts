import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateWeddingSlug } from "@/lib/wedding-slug"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const body = await request.json()
  const {
    style, nombre1, nombre2, frase,
    fecha, hora, lugar, direccion, mapsUrl, musicaUrl,
    dresscode, regalos, fotoportada, fotos, modules,
  } = body

  if (!nombre1 || !nombre2 || !fecha || !hora || !lugar) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: nombre1, nombre2, fecha, hora, lugar." },
      { status: 400 }
    )
  }

  // Generate a unique slug (retry up to 5 times on collision)
  let slug = ""
  for (let i = 0; i < 5; i++) {
    const candidate = generateWeddingSlug(nombre1, nombre2)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma as any).weddingInvitation.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
    if (!existing) { slug = candidate; break }
  }
  if (!slug) {
    return NextResponse.json({ error: "No se pudo generar un slug único." }, { status: 500 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitation = await (prisma as any).weddingInvitation.create({
    data: {
      userId: session.user.id,
      slug,
      style: style ?? "JARDIN",
      nombre1,
      nombre2,
      frase: frase ?? null,
      fecha: new Date(fecha),
      hora,
      lugar,
      direccion: direccion ?? null,
      mapsUrl: mapsUrl ?? null,
      musicaUrl: musicaUrl ?? null,
      dresscode: dresscode ?? null,
      regalos: regalos ?? null,
      fotoportada: fotoportada ?? null,
      fotos: fotos ?? [],
      modules: modules ?? {},
      pagado: false,
    },
    select: { id: true, slug: true },
  })

  return NextResponse.json({ id: invitation.id, slug: invitation.slug }, { status: 201 })
}
