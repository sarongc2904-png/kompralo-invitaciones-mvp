import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getStripe, getBaseUrl } from "@/lib/stripe"
import { MercadoPagoConfig, Preference } from "mercadopago"

const PLAN_NAME = "Invitación de Boda Premium"
const AMOUNT_MXN = 79900 // centavos → $799.00 MXN

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const { invitationId, provider } = await request.json()
  if (!invitationId || !["stripe", "mercadopago"].includes(provider)) {
    return NextResponse.json({ error: "Datos de pago inválidos." }, { status: 400 })
  }

  // Verify the invitation belongs to this user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitation = await (prisma as any).weddingInvitation.findUnique({
    where: { id: invitationId },
    select: { id: true, userId: true, slug: true, nombre1: true, nombre2: true },
  })

  if (!invitation || invitation.userId !== session.user.id) {
    return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 })
  }

  if (invitation.pagado) {
    return NextResponse.json({ error: "Esta invitación ya fue pagada." }, { status: 400 })
  }

  const baseUrl = getBaseUrl(request.headers.get("origin"))

  // ── Stripe ─────────────────────────────────────────────────────────────────
  if (provider === "stripe") {
    let stripe: ReturnType<typeof getStripe>
    try {
      stripe = getStripe()
    } catch {
      return NextResponse.json(
        { error: "Stripe no configurado. Agrega STRIPE_SECRET_KEY." },
        { status: 500 }
      )
    }

    const checkoutSession = await stripe.checkout.sessions
      .create({
        mode: "payment",
        payment_method_types: ["card"],
        locale: "es-419",
        customer_email: session.user.email ?? undefined,
        // {CHECKOUT_SESSION_ID} is replaced by Stripe with the actual session id.
        // The success page uses it to verify the payment directly (no webhook needed in dev).
        success_url: `${baseUrl}/pago/exitoso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pago/cancelado`,
        metadata: {
          wedding_invitation_id: invitation.id,
          user_id: session.user.id,
          plan_slug: "boda",
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "mxn",
              unit_amount: AMOUNT_MXN,
              product_data: {
                name: `${PLAN_NAME} — ${invitation.nombre1} & ${invitation.nombre2}`,
                description: "Invitación digital interactiva con todos los módulos incluidos.",
              },
            },
          },
        ],
      })
      .catch(() => null)

    if (!checkoutSession?.url) {
      return NextResponse.json({ error: "No se pudo crear la sesión de Stripe." }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  }

  // ── MercadoPago ────────────────────────────────────────────────────────────
  if (provider === "mercadopago") {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json(
        { error: "MercadoPago no configurado. Agrega MERCADO_PAGO_ACCESS_TOKEN." },
        { status: 500 }
      )
    }

    const mpClient = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(mpClient)

    try {
      const result = await preference.create({
        body: {
          items: [
            {
              id: "boda",
              title: `${PLAN_NAME} — ${invitation.nombre1} & ${invitation.nombre2}`,
              quantity: 1,
              unit_price: 799,
              currency_id: "MXN",
            },
          ],
          back_urls: {
            success: `${baseUrl}/pago/exitoso?slug=${invitation.slug}`,
            failure: `${baseUrl}/pago/cancelado`,
            pending: `${baseUrl}/pago/exitoso?slug=${invitation.slug}`,
          },
          auto_return: "approved",
          external_reference: invitation.id,
        },
      })

      const url = result.init_point
      if (!url) throw new Error("Sin URL de pago")
      return NextResponse.json({ url })
    } catch {
      return NextResponse.json(
        { error: "No se pudo crear el pago con MercadoPago." },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: "Proveedor no soportado." }, { status: 400 })
}
