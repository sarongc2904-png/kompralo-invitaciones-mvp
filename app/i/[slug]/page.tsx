import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Gift, MapPin, Shirt } from "lucide-react";
import { PublicRsvpForm } from "@/components/public/PublicRsvpForm";
import { prisma } from "@/lib/prisma";

type PublicInvitationPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({ params }: PublicInvitationPageProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { template: true }
  }).catch(() => null);

  if (!event || event.status !== "PUBLISHED") {
    notFound();
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

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-glow luxury-border">
      <div className="text-gold">{icon}</div>
      <p className="mt-4 font-semibold text-ink">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">{value}</p>
    </div>
  );
}
