import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Gift, LockKeyhole, MapPin, Shirt } from "lucide-react";
import { PublicRsvpForm } from "@/components/public/PublicRsvpForm";
import { parseEventCustomContent } from "@/lib/event-notes";
import { prisma } from "@/lib/prisma";

type PublicInvitationPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({ params }: PublicInvitationPageProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      template: true,
      payments: {
        select: {
          status: true
        }
      }
    }
  }).catch(() => null);

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  const customContent = parseEventCustomContent(event.notes);
  const hasConfirmedPayment =
    event.payments.some((payment) => payment.status === "PAID") || Boolean(customContent.paymentSessionId);

  if (!hasConfirmedPayment) {
    return <PaymentRequiredInvitation />;
  }

  const hero = event.heroImage || event.template?.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="bg-pearl">
      <section className="relative grid min-h-[86vh] place-items-center overflow-hidden px-4 text-center text-pearl">
        <Image src={hero} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/62" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{event.type}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-7xl">{event.title}</h1>
          <p className="mt-5 text-xl text-pearl/82">{event.honoree}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Info icon={<CalendarDays />} label="Fecha" value={event.eventDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} />
          <Info icon={<Clock />} label="Hora" value={event.eventTime} />
          <Info icon={<MapPin />} label="Dirección" value={event.address} />
          <Info icon={<Shirt />} label="Dress code" value={event.dressCode ?? "Libre"} />
          <Info icon={<Gift />} label="Mesa de regalos" value={event.giftTable ?? "Tu presencia es el mejor regalo"} />
        </div>
        <PublicRsvpForm eventId={event.id} />
      </section>
    </div>
  );
}

function PaymentRequiredInvitation() {
  return (
    <section className="grid min-h-[72vh] place-items-center bg-pearl px-4 py-16 text-center">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-glow luxury-border sm:p-8">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-gold">
          <LockKeyhole size={25} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-gold">Invitacion pendiente</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Falta finalizar el pago</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink/65 sm:text-base">
          Tu invitacion ya puede previsualizarse, pero para publicarla y compartirla con tus invitados primero debes elegir un plan y completar el pago.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/precios"
            className="inline-flex items-center justify-center rounded-md bg-ink px-6 py-4 text-sm font-bold text-pearl transition hover:bg-emerald"
          >
            Ver planes y pagar
          </Link>
          <Link
            href="/formulario"
            className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-6 py-4 text-sm font-bold text-ink transition hover:border-gold hover:text-gold"
          >
            Editar borrador
          </Link>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-glow luxury-border">
      <div className="text-gold">{icon}</div>
      <p className="mt-4 font-semibold text-ink">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">{value}</p>
    </div>
  );
}
