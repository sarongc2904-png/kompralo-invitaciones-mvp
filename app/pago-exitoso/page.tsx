import Link from "next/link";
import { CheckCircle2, ClipboardList, ReceiptText } from "lucide-react";
import { getPlanById } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

type PagoExitosoPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

type PaymentSummary = {
  planName: string;
  amount: string;
  status: string;
};

async function getPaymentSummary(sessionId?: string): Promise<PaymentSummary | null> {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const planId = session.metadata?.plan_slug ?? session.metadata?.planId ?? null;
  const plan = getPlanById(planId);
  const amount = typeof session.amount_total === "number" ? session.amount_total / 100 : plan ? plan.amount / 100 : 0;

  return {
    planName: session.metadata?.plan_name ?? session.metadata?.planName ?? plan?.name ?? "Invitacion digital",
    amount: amount.toLocaleString("es-MX", {
      style: "currency",
      currency: (session.currency ?? "mxn").toUpperCase()
    }),
    status: session.payment_status === "paid" ? "Pagado" : "Pendiente"
  };
}

export const metadata = {
  title: "Pago exitoso"
};

export default async function PagoExitosoPage({ searchParams }: PagoExitosoPageProps) {
  const { session_id: sessionId } = await searchParams;
  const summary = await getPaymentSummary(sessionId).catch(() => null);

  return (
    <section className="grid min-h-[72vh] place-items-center bg-pearl px-4 py-16">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 text-center shadow-glow luxury-border sm:p-8">
        <CheckCircle2 className="mx-auto text-emerald" size={58} />
        <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">Pago exitoso</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base">
          Gracias por tu compra. Ahora entra a tu dashboard para editar las secciones incluidas en tu plan.
        </p>

        <div className="mt-8 grid gap-3 rounded-lg bg-pearl p-4 text-left luxury-border sm:grid-cols-3">
          <SummaryItem icon={<ReceiptText size={18} />} label="Plan" value={summary?.planName ?? "Pago recibido"} />
          <SummaryItem icon={<ReceiptText size={18} />} label="Importe" value={summary?.amount ?? "Confirmado en Stripe"} />
          <SummaryItem icon={<ReceiptText size={18} />} label="Estado" value={summary?.status ?? "Exitoso"} />
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-6 py-4 text-sm font-bold text-pearl transition hover:bg-emerald sm:w-auto"
        >
          <ClipboardList size={17} />
          Ir al dashboard
        </Link>
      </div>
    </section>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-4 luxury-border">
      <div className="flex items-center gap-2 text-gold">
        {icon}
        <p className="text-xs font-bold uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
