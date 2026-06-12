import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/DeleteButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EventStatusForm } from "@/components/dashboard/EventStatusForm";
import { GuestCreateForm } from "@/components/dashboard/GuestCreateForm";
import { requireUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const session = await requireUser();
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { guests: true, rsvps: true, template: true }
  }).catch(() => null);

  if (!event || (session.user.role !== "ADMIN" && event.ownerId !== session.user.id)) {
    notFound();
  }

  return (
    <DashboardShell title={event.title} description="Gestiona invitados, RSVP y publicación." role={session.user.role}>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg bg-white p-6 shadow-glow luxury-border">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Invitación pública</p>
          <Link href={`/i/${event.slug}`} className="mt-3 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-black text-pearl hover:bg-emerald">
            Abrir invitación pública
          </Link>
          <dl className="mt-6 grid gap-3 text-sm text-ink/70 sm:grid-cols-2">
            <Info label="Festejado" value={event.honoree} />
            <Info label="Fecha" value={event.eventDate.toLocaleDateString("es-MX")} />
            <Info label="Hora" value={event.eventTime} />
            <Info label="Estado" value={event.status} />
            <Info label="Dirección" value={event.address} />
            <Info label="Dress code" value={event.dressCode ?? "Sin definir"} />
          </dl>
          <div className="mt-6">
            <EventStatusForm eventId={event.id} status={event.status} />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-glow luxury-border">
          <p className="font-display text-3xl text-ink">RSVP</p>
          <p className="mt-2 text-sm text-ink/62">{event.rsvps.length} respuestas recibidas</p>
          <div className="mt-5 grid gap-2">
            {event.rsvps.slice(0, 6).map((rsvp) => (
              <div key={rsvp.id} className="rounded-md bg-pearl p-3 text-sm">
                <span className="font-semibold text-ink">{rsvp.name}</span> · {rsvp.status}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-3xl text-ink">Invitados</h2>
        <GuestCreateForm eventId={event.id} />
        <div className="mt-5 grid gap-3">
          {event.guests.map((guest) => (
            <div key={guest.id} className="flex flex-col gap-3 rounded-lg bg-white p-4 text-sm shadow-glow luxury-border sm:flex-row sm:items-center sm:justify-between">
              <span><span className="font-semibold text-ink">{guest.name}</span> · {guest.status} · {guest.seats} lugar(es)</span>
              <DeleteButton endpoint={`/api/guests/${guest.id}`} />
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
