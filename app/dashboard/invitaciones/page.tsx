import Link from "next/link"
import { IconEye, IconUserCheck, IconUserX, IconBrandWhatsapp, IconPlus, IconExternalLink } from "@tabler/icons-react"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"
import { CopyLinkButton } from "./CopyLinkButton"

export const dynamic = "force-dynamic"
export const metadata = { title: "Mis invitaciones de boda" }

const STYLE_META: Record<string, { label: string; bg: string; text: string }> = {
  JARDIN: { label: "Jardín Secreto", bg: "#1a2e1a", text: "#c5a864" },
  CIELO:  { label: "Cielo Nocturno", bg: "#0c2240", text: "#c0d2f0" },
  ARENA:  { label: "Arena y Miel",   bg: "#3d2a10", text: "#e6be78" },
}

function formatDate(d: Date) {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
}

export default async function InvitacionesPage() {
  const session = await requireUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitaciones = await (prisma as any).weddingInvitation.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      slug: true,
      style: true,
      nombre1: true,
      nombre2: true,
      fecha: true,
      lugar: true,
      vistas: true,
      confirmados: true,
      rechazados: true,
      pagado: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

  return (
    <DashboardShell
      title="Mis invitaciones"
      description="Aquí están todas las invitaciones de boda que has creado."
      role="Cliente"
    >
      {/* Header row */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">
            {invitaciones.length} invitación{invitaciones.length !== 1 ? "es" : ""}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none text-ink">
            {invitaciones.length === 0 ? "Aún no has creado ninguna" : "Todas tus bodas"}
          </h2>
        </div>
        <Link
          href="/crear"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-emerald"
        >
          <IconPlus size={17} />
          Nueva invitación
        </Link>
      </div>

      {/* Empty state */}
      {invitaciones.length === 0 && (
        <div className="rounded-[1.35rem] border border-black/10 bg-white p-10 text-center shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
          <p className="text-5xl mb-4">💍</p>
          <h3 className="font-display text-3xl text-ink">Crea tu primera invitación</h3>
          <p className="mt-3 text-sm leading-6 text-ink/60 max-w-sm mx-auto">
            En menos de 5 minutos tienes una invitación digital elegante lista para compartir con tus invitados.
          </p>
          <Link
            href="/crear"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-black text-white hover:bg-emerald transition-colors"
          >
            <IconPlus size={17} />
            Crear invitación de boda
          </Link>
        </div>
      )}

      {/* Cards grid */}
      {invitaciones.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {invitaciones.map((inv: {
            id: string
            slug: string
            style: string
            nombre1: string
            nombre2: string
            fecha: Date
            lugar: string
            vistas: number
            confirmados: number
            rechazados: number
            pagado: boolean
            createdAt: Date
          }) => {
            const style = STYLE_META[inv.style] ?? STYLE_META.JARDIN
            const invUrl = `${baseUrl}/boda/${inv.slug}`
            const waText = encodeURIComponent(
              `¡${inv.nombre1} y ${inv.nombre2} nos casamos! 💍 Mira nuestra invitación: ${invUrl}`
            )

            return (
              <article
                key={inv.id}
                className="flex flex-col rounded-[1.35rem] border border-black/10 bg-white shadow-[0_18px_65px_rgba(17,17,20,0.08)] overflow-hidden"
              >
                {/* Style header */}
                <div
                  className="px-6 py-5 flex items-center justify-between"
                  style={{ background: style.bg }}
                >
                  <div>
                    <p
                      className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60"
                      style={{ color: style.text }}
                    >
                      {style.label}
                    </p>
                    <h3
                      className="mt-1 font-display text-2xl leading-none"
                      style={{ color: style.text }}
                    >
                      {inv.nombre1} &amp; {inv.nombre2}
                    </h3>
                    <p
                      className="mt-1 text-xs opacity-60"
                      style={{ color: style.text }}
                    >
                      {formatDate(new Date(inv.fecha))}
                    </p>
                  </div>
                  {/* Status pill */}
                  {inv.pagado ? (
                    <span className="shrink-0 rounded-full bg-emerald/20 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-wider text-emerald">
                      Activa
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-wider text-amber-700">
                      Pendiente
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-5 p-5">
                  {/* Venue */}
                  {inv.lugar && (
                    <p className="text-xs text-ink/55 font-semibold leading-5">
                      📍 {inv.lugar}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <StatPill icon={<IconEye size={13} />} value={inv.vistas} label="vistas" color="text-ink/60" />
                    <StatPill icon={<IconUserCheck size={13} />} value={inv.confirmados} label="confirm." color="text-emerald" />
                    <StatPill icon={<IconUserX size={13} />} value={inv.rechazados} label="declina." color="text-red-400" />
                  </div>

                  {/* Pending payment notice */}
                  {!inv.pagado && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-700">
                      Tu invitación está guardada pero aún no está activa.{" "}
                      <Link href="/precios" className="underline underline-offset-2 hover:text-amber-900">
                        Completa el pago →
                      </Link>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    <CopyLinkButton url={invUrl} />
                    <a
                      href={`https://wa.me/?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#1ebe5c]"
                    >
                      <IconBrandWhatsapp size={14} />
                      WhatsApp
                    </a>
                    <Link
                      href={`/boda/${inv.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-xs font-black text-ink transition hover:border-gold hover:text-emerald"
                    >
                      <IconExternalLink size={14} />
                      Ver
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-black/8 bg-[#fbfaf7] py-3">
      <span className={`flex items-center gap-1 text-lg font-black ${color}`}>
        {icon}
        {value}
      </span>
      <span className="text-[0.6rem] font-black uppercase tracking-wide text-ink/40">{label}</span>
    </div>
  )
}
