import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getPlanById } from "@/lib/plans";
import { getBaseUrl } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const plan = getPlanById(body?.planId);

  if (!plan) {
    return NextResponse.json({ error: "Plan no válido." }, { status: 400 });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Mercado Pago no está configurado. Agrega MERCADO_PAGO_ACCESS_TOKEN." },
      { status: 500 }
    );
  }

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);
  const baseUrl = getBaseUrl(request.headers.get("origin"));

  const response = await preference.create({
    body: {
      items: [
        {
          id: plan.id,
          title: `Kompralo Invitaciones - ${plan.name}`,
          quantity: 1,
          unit_price: plan.amount / 100,
          currency_id: "MXN"
        }
      ],
      back_urls: {
        success: `${baseUrl}/pago-exitoso`,
        failure: `${baseUrl}/precios?cancelado=1`,
        pending: `${baseUrl}/precios?pendiente=1`
      },
      metadata: {
        planId: plan.id,
        provider: "mercado_pago"
      }
    }
  });

  return NextResponse.json({ checkoutUrl: response.init_point });
}
