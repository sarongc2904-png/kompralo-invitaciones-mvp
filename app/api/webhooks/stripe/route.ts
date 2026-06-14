import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma de Stripe no valida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const userId = checkoutSession.metadata?.user_id;
    const planSlug = checkoutSession.metadata?.plan_slug;
    const weddingInvitationId = checkoutSession.metadata?.wedding_invitation_id;

    // ── Wedding invitation payment ─────────────────────────────────────────
    if (weddingInvitationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).weddingInvitation.update({
        where: { id: weddingInvitationId },
        data: { pagado: true },
      }).catch(() => null);
      return NextResponse.json({ received: true });
    }

    if (!userId || !planSlug) {
      return NextResponse.json({ error: "Metadata incompleta." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const paidAt = new Date().toISOString();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .upsert(
        {
          user_id: userId,
          plan_slug: planSlug,
          stripe_session_id: checkoutSession.id,
          paid_at: paidAt
        },
        { onConflict: "stripe_session_id" }
      )
      .select("id,user_id,plan_slug")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "No se pudo guardar la orden." }, { status: 500 });
    }

    const { data: existingInvitation } = await supabase
      .from("invitations")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();

    if (!existingInvitation) {
      const { error: invitationError } = await supabase.from("invitations").insert({
        order_id: order.id,
        user_id: userId,
        design_template: checkoutSession.metadata?.modelo || null,
        rsvp_enabled: true,
        gallery_urls: [],
        visual_style: {},
        status: "draft"
      });

      if (invitationError) {
        return NextResponse.json({ error: "No se pudo crear la invitacion." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
