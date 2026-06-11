import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/lib/plans";
import { getBaseUrl, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const planId = String(formData.get("planId") ?? "");
  const plan = getPlanById(planId);

  if (!plan) {
    return NextResponse.json({ error: "Plan no válido." }, { status: 400 });
  }

  const baseUrl = getBaseUrl(request.headers.get("origin"));
  let stripe: ReturnType<typeof getStripe>;

  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Stripe no está configurado. Agrega STRIPE_SECRET_KEY en las variables de entorno." },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions
    .create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "es-419",
      success_url: `${baseUrl}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/precios?cancelado=1`,
      metadata: {
        planId: plan.id,
        planName: plan.name
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "mxn",
            unit_amount: plan.amount,
            product_data: {
              name: `Kompralo Invitaciones - ${plan.name}`,
              description: plan.description
            }
          }
        }
      ]
    })
    .catch(() => null);

  if (!session?.url) {
    return NextResponse.json({ error: "No se pudo crear la sesión de pago." }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
