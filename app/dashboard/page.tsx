import Link from "next/link";
import { CalendarDays, LayoutTemplate, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireUser();
  const [events, templates] = await Promise.all([
    prisma.event.count({ where: session.user.role === "ADMIN" ? {} : { ownerId: session.user.id } }).catch(() => 0),
    prisma.template.count().catch(() => 0)
  ]);

  return (
    <DashboardShell title="Panel principal" description="Resumen operativo de tus invitaciones digitales." role={session.user.role}>
      <div className="grid gap-5 md:grid-cols-3">
        <Metric icon={<CalendarDays />} label="Eventos" value={events} href="/dashboard/eventos" />
        <Metric icon={<Users />} label="Invitados y RSVP" value="Activo" href="/dashboard/eventos" />
        <Metric icon={<LayoutTemplate />} label="Plantillas" value={templates} href="/dashboard/admin/plantillas" />
      </div>
      <div className="mt-8 rounded-lg bg-white p-6 shadow-glow luxury-border">
        <h2 className="font-display text-3xl text-ink">Siguiente acción</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Crea un evento, publícalo y comparte su liga pública en formato `/i/[slug]`.
        </p>
        <Link href="/dashboard/eventos" className="mt-5 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl hover:bg-emerald">
          Gestionar eventos
        </Link>
      </div>
    </DashboardShell>
  );
}

function Metric({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="rounded-lg bg-white p-6 shadow-glow luxury-border transition hover:-translate-y-0.5">
      <div className="text-gold">{icon}</div>
      <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-ink/50">{label}</p>
      <p className="mt-2 font-display text-4xl text-ink">{value}</p>
    </Link>
  );
}
