import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPlanById } from "@/lib/plans";
import { getBaseUrl, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const planSlug = String(formData.get("plan_slug") ?? formData.get("planId") ?? "");
  const modelo = String(formData.get("modelo") ?? "");
  const plan = getPlanById(planSlug);
  const session = await auth();
  const baseUrl = getBaseUrl(request.headers.get("origin"));

  if (!session?.user?.id) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("callbackUrl", "/precios");
    return NextResponse.redirect(loginUrl, 303);
  }

  if (!plan) {
    return NextResponse.json({ error: "Plan no valido." }, { status: 400 });
  }

  let stripe: ReturnType<typeof getStripe>;

  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Stripe no esta configurado. Agrega STRIPE_SECRET_KEY en las variables de entorno." },
      { status: 500 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions
    .create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "es-419",
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/precios?cancelado=1`,
      customer_email: session.user.email ?? undefined,
      metadata: {
        plan_slug: plan.id,
        plan_name: plan.name,
        user_id: session.user.id,
        user_email: session.user.email ?? "",
        modelo
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

  if (!checkoutSession?.url) {
    return NextResponse.json({ error: "No se pudo crear la sesion de pago." }, { status: 500 });
  }

  return NextResponse.redirect(checkoutSession.url, 303);
}
