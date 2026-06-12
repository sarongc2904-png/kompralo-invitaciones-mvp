import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, LayoutTemplate, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireUser();
  const where = session.user.role === "ADMIN" ? {} : { ownerId: session.user.id };
  const [events, templates, rsvps, payments] = await Promise.all([
    prisma.event.count({ where }).catch(() => 0),
    prisma.template.count().catch(() => 0),
    prisma.rsvp.count(session.user.role === "ADMIN" ? undefined : { where: { event: { ownerId: session.user.id } } }).catch(() => 0),
    prisma.payment.count().catch(() => 0)
  ]);

  return (
    <DashboardShell title="Panel principal" description="Resumen ejecutivo de tus invitaciones digitales." role={session.user.role}>
      <div className="grid gap-5 md:grid-cols-4">
        <Metric icon={<CalendarDays />} label="Eventos" value={events} href="/dashboard/eventos" />
        <Metric icon={<Users />} label="RSVP" value={rsvps} href="/dashboard/eventos" />
        <Metric icon={<LayoutTemplate />} label="Plantillas" value={templates} href="/dashboard/admin/plantillas" />
        <Metric icon={<CreditCard />} label="Pagos" value={payments} href="/precios" />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] bg-white p-7 shadow-[0_18px_65px_rgba(17,17,20,0.08)] ring-1 ring-ink/8">
          <h2 className="font-display text-4xl text-ink">Siguiente acción</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Crea un evento, publícalo y comparte el enlace de la invitación con tus invitados.
          </p>
          <Link href="/dashboard/eventos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-pearl hover:bg-emerald">
            Gestionar eventos
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rounded-[1.5rem] bg-white p-7 shadow-[0_18px_65px_rgba(17,17,20,0.08)] ring-1 ring-ink/8">
          <h2 className="font-display text-3xl text-ink">Operación premium</h2>
          <div className="mt-5 grid gap-3 text-sm text-ink/66">
            <Status label="Base de datos" value="Conectada" />
            <Status label="RSVP" value="Activo" />
            <Status label="Checkout" value="Stripe / Mercado Pago" />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="rounded-[1.35rem] bg-white p-6 shadow-[0_18px_65px_rgba(17,17,20,0.08)] ring-1 ring-ink/8 transition hover:-translate-y-1 hover:ring-gold/45">
      <div className="text-gold">{icon}</div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-ink/46">{label}</p>
      <p className="mt-2 font-display text-4xl text-ink">{value}</p>
    </Link>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-pearl px-4 py-3">
      <span>{label}</span>
      <span className="font-black text-emerald">{value}</span>
    </div>
  );
}
