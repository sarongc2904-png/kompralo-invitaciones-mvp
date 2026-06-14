import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { CopyButton } from "./CopyButton"

export const metadata = { title: "¡Pago exitoso! Tu invitación está lista" }

const STYLE_EMOJI: Record<string, string> = {
  JARDIN: "🌿",
  CIELO:  "✨",
  ARENA:  "🌾",
}

// Two entry points:
//   Stripe:  /pago/exitoso?session_id=cs_xxx   ← verifica con Stripe y marca pagado
//   Fallback: /pago/exitoso?slug=xxx            ← MercadoPago / invitación ya pagada
export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; slug?: string }>
}) {
  const { session_id, slug: slugParam } = await searchParams

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inv: { slug: string; nombre1: string; nombre2: string; style: string } | null = null

  // ── Stripe: verifica el pago y actualiza la BD ────────────────────────────
  if (session_id) {
    let stripeSession: Awaited<ReturnType<ReturnType<typeof getStripe>["checkout"]["sessions"]["retrieve"]>>

    try {
      stripeSession = await getStripe().checkout.sessions.retrieve(session_id)
    } catch {
      // Stripe no configurado o session_id inválido
      notFound()
      return
    }

    // Pago no completado — redirigir a cancelado implícitamente mostrando error
    if (stripeSession.payment_status !== "paid") {
      return (
        <ErrorLayout
          title="Pago no completado"
          description="El pago no fue procesado correctamente. Si crees que es un error, revisa tu banco e inténtalo de nuevo."
          cta={{ href: "/pago/cancelado", label: "Volver e intentar de nuevo" }}
        />
      )
    }

    const invitationId = stripeSession.metadata?.wedding_invitation_id
    if (!invitationId) notFound()

    // Marcar como pagado (idempotente: si ya estaba en true no importa)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (prisma as any).weddingInvitation.update({
      where: { id: invitationId },
      data: { pagado: true },
      select: { slug: true, nombre1: true, nombre2: true, style: true },
    }).catch(() => null)

    if (!updated) notFound()
    inv = updated
  }

  // ── Fallback por slug (MercadoPago o invitación ya activada) ─────────────
  else if (slugParam) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inv = await (prisma as any).weddingInvitation.findUnique({
      where: { slug: slugParam },
      select: { slug: true, nombre1: true, nombre2: true, style: true },
    })
    if (!inv) notFound()
  }

  else {
    notFound()
  }

  // notFound() returns `never` but TS loses track across complex branches
  if (!inv) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const invUrl  = `${baseUrl}/boda/${inv.slug}`
  const waText  = encodeURIComponent(
    `¡${inv.nombre1} y ${inv.nombre2} nos casamos! 💍 Mira nuestra invitación digital: ${invUrl}`
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{STYLE_EMOJI[inv.style] ?? "💍"}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Tu invitación está lista!
          </h1>
          <p className="text-gray-500">
            {inv.nombre1} &amp; {inv.nombre2} — compártela con tus invitados.
          </p>
        </div>

        {/* URL card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
            Enlace de tu invitación
          </p>
          <p className="font-mono text-sm text-gray-900 break-all bg-gray-50 rounded-lg px-3 py-2 border mb-4">
            {invUrl}
          </p>
          <div className="flex flex-wrap gap-3">
            <CopyButton url={invUrl} />
            <a
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-medium text-sm hover:bg-[#20b858] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Compartir por WhatsApp
            </a>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/boda/${inv.slug}`}
            target="_blank"
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-center font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Ver mi invitación →
          </Link>
          <Link
            href="/dashboard/invitaciones"
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-center font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Ir a mis bodas
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          También puedes encontrar el enlace en tu dashboard en cualquier momento.
        </p>
      </div>
    </div>
  )
}

function ErrorLayout({
  title,
  description,
  cta,
}: {
  title: string
  description: string
  cta: { href: string; label: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 text-sm leading-6 mb-6">{description}</p>
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  )
}
