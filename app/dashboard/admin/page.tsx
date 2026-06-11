import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
  const [users, events, templates] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.event.count().catch(() => 0),
    prisma.template.count().catch(() => 0)
  ]);

  return (
    <DashboardShell title="Administrador" description="Operación global del SaaS Kompralo." role={session.user.role}>
      <div className="grid gap-5 md:grid-cols-3">
        <AdminCard label="Usuarios" value={users} />
        <AdminCard label="Eventos" value={events} />
        <AdminCard label="Plantillas" value={templates} href="/dashboard/admin/plantillas" />
      </div>
      <Link href="/dashboard/admin/plantillas" className="mt-8 inline-flex rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl hover:bg-emerald">
        Administrar plantillas
      </Link>
    </DashboardShell>
  );
}

function AdminCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <div className="rounded-lg bg-white p-6 shadow-glow luxury-border">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">{label}</p>
      <p className="mt-3 font-display text-4xl text-ink">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
