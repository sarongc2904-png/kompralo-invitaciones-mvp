import Link from "next/link";
import { DeleteButton } from "@/components/dashboard/DeleteButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EventCreateForm } from "@/components/dashboard/EventCreateForm";
import { requireUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const session = await requireUser();
  const events = await prisma.event.findMany({
    where: session.user.role === "ADMIN" ? {} : { ownerId: session.user.id },
    include: { guests: true, rsvps: true },
    orderBy: { createdAt: "desc" }
  }).catch(() => []);

  return (
    <DashboardShell title="Eventos" description="CRUD de eventos para tus invitaciones digitales." role={session.user.role}>
      <EventCreateForm />
      <div className="mt-8 grid gap-4">
        {events.map((event) => (
          <article key={event.id} className="rounded-lg bg-white p-5 shadow-glow luxury-border">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{event.status}</p>
                <h2 className="mt-2 font-display text-3xl text-ink">{event.title}</h2>
                <p className="mt-1 text-sm text-ink/62">{event.type} · {event.guests.length} invitados · {event.rsvps.length} RSVP</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/eventos/${event.id}`} className="rounded-md border border-ink/12 px-4 py-2 text-sm font-semibold text-ink">Editar</Link>
                <Link href={`/i/${event.slug}`} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-pearl">Ver pública</Link>
                <DeleteButton endpoint={`/api/events/${event.id}`} />
              </div>
            </div>
          </article>
        ))}
        {!events.length ? <p className="rounded-lg bg-white p-5 text-sm text-ink/62 luxury-border">Todavía no hay eventos.</p> : null}
      </div>
    </DashboardShell>
  );
}
