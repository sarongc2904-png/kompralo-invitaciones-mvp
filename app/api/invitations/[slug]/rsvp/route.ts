import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await request.json()
  const { nombre, email, telefono, asistentes, status, mensaje } = body

  if (!nombre?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 })
  }
  if (!["CONFIRMED", "DECLINED"].includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitation = await (prisma as any).weddingInvitation.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!invitation) {
    return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).weddingRsvp.create({
    data: {
      invitationId: invitation.id,
      nombre: nombre.trim(),
      email:  email?.trim()    || null,
      telefono: telefono?.trim() || null,
      asistentes: Math.max(1, Number(asistentes) || 1),
      status,
      mensaje: mensaje?.trim() || null,
    },
  })

  // Increment the denormalized counter
  const counterField = status === "CONFIRMED" ? "confirmados" : "rechazados"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).weddingInvitation.update({
    where: { id: invitation.id },
    data: { [counterField]: { increment: 1 } },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
