import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Gift, MapPin, Music, QrCode, Shirt, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoEvent } from "@/types";
import { Countdown } from "./Countdown";
import { RSVPForm } from "./RSVPForm";

export function InvitationDemo({ event }: { event: DemoEvent }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `https://kompralo.com.mx/demo/${event.slug}`
  )}`;

  return (
    <div className="bg-pearl">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src={event.heroImage}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/42 to-ink/78" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center text-pearl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-gold">{event.host}</p>
          <h1 className="font-display text-5xl leading-none sm:text-7xl md:text-8xl">{event.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-pearl/84">{event.subtitle}</p>
          <div className="mt-10 w-full max-w-2xl">
            <Countdown date={event.date} time={event.time} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Info icon={<CalendarDays size={20} />} title="Fecha" value={new Date(`${event.date}T00:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} />
          <Info icon={<Clock size={20} />} title="Hora" value={event.time} />
          <Info icon={<MapPin size={20} />} title="Lugar" value={`${event.venue} · ${event.address}`} />
          <Info icon={<Shirt size={20} />} title="Dress code" value={event.dressCode} />
          <Info icon={<Gift size={20} />} title="Mesa de regalos" value={event.giftTable} />
          <Info icon={<Music size={20} />} title="Música" value="Disponible bajo solicitud" />
        </div>
        <div className="rounded-lg bg-white p-5 shadow-glow luxury-border">
          <p className="font-display text-2xl text-ink">Ubicación</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">{event.address}</p>
          <Link
            href={event.mapsUrl}
            target="_blank"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl transition hover:bg-emerald"
          >
            <MapPin size={16} />
            Abrir Google Maps
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {event.gallery.map((image, index) => (
              <div key={image} className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-glow">
                <Image
                  src={image}
                  alt={`${event.title} galeria ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
        <RSVPForm eventSlug={event.slug} />
        <div className="rounded-lg bg-ink p-6 text-pearl shadow-glow">
          <div className="flex items-center gap-3 text-gold">
            <QrCode />
            <p className="font-semibold uppercase tracking-[0.2em]">Código QR</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-[220px_1fr] sm:items-center">
            <Image src={qrUrl} alt={`QR ${event.title}`} width={220} height={220} className="rounded-md bg-white p-3" />
            <div>
              <p className="font-display text-3xl">Comparte esta invitación</p>
              <p className="mt-3 text-sm leading-6 text-pearl/72">
                Tus invitados pueden abrirla desde el código QR o confirmar por WhatsApp.
              </p>
              <Link
                href={buildWhatsAppUrl(event.whatsappMessage)}
                target="_blank"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm font-bold text-ink transition hover:bg-pearl"
              >
                <MessageCircle size={16} />
                Confirmar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-glow luxury-border">
      <div className="mb-4 inline-grid size-10 place-items-center rounded-full bg-champagne text-gold">{icon}</div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">{value}</p>
    </div>
  );
}
