import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Fraunces, Lora, Playfair_Display } from "next/font/google";
import { CalendarDays, Clock, Gift, MapPin, MessageCircle, Music, QrCode, Shirt, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { DemoEvent } from "@/types";
import { Countdown } from "./Countdown";
import { RSVPForm } from "./RSVPForm";

const weddingFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const xvFont = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const softFont = Lora({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const modernFont = Fraunces({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

const demoStyle = {
  boda: {
    font: weddingFont.className,
    label: "Boda deluxe",
    bg: "from-[#f8f2e8] via-[#fffaf2] to-[#ecdfcf]",
    overlay: "from-black/82 via-black/45 to-black/72",
    card: "bg-[#0d1713]/88 text-pearl"
  },
  xv: {
    font: xvFont.className,
    label: "XV años deluxe",
    bg: "from-[#fff3f7] via-[#fffaf2] to-[#f4e1c4]",
    overlay: "from-[#2a0e19]/82 via-[#3a1524]/42 to-[#16070d]/78",
    card: "bg-[#231019]/88 text-pearl"
  },
  bautizo: {
    font: softFont.className,
    label: "Bautizo deluxe",
    bg: "from-[#f8fbff] via-[#fffaf2] to-[#e4f0f8]",
    overlay: "from-[#071827]/78 via-[#12324d]/35 to-[#071827]/74",
    card: "bg-[#0b2132]/88 text-pearl"
  },
  cumple: {
    font: modernFont.className,
    label: "Cumpleaños deluxe",
    bg: "from-[#f8f4ff] via-[#fffaf2] to-[#111114]",
    overlay: "from-black/84 via-[#1d0b34]/46 to-black/80",
    card: "bg-[#111114]/90 text-pearl"
  },
  "baby-shower": {
    font: softFont.className,
    label: "Baby Shower deluxe",
    bg: "from-[#fff1f2] via-[#fffaf2] to-[#f6dee5]",
    overlay: "from-[#2b1b21]/76 via-[#5e3340]/34 to-[#24161b]/72",
    card: "bg-[#2b1b21]/88 text-pearl"
  }
} as const;

export function InvitationDemo({ event }: { event: DemoEvent }) {
  const style = demoStyle[event.slug as keyof typeof demoStyle] ?? demoStyle.boda;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    `https://kompralo.com.mx/demo/${event.slug}`
  )}`;
  const cssVars = {
    "--event-accent": event.accent,
    "--event-secondary": event.secondaryAccent
  } as CSSProperties;

  return (
    <div className={`bg-gradient-to-br ${style.bg} text-ink`} style={cssVars}>
      <section className="relative min-h-[94svh] overflow-hidden">
        <Image src={event.heroImage} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-br ${style.overlay}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.28),transparent_22%),radial-gradient(circle_at_15%_92%,rgba(198,161,91,0.22),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[94svh] max-w-7xl items-end gap-10 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.75fr] lg:px-8 lg:pb-16">
          <div className="max-w-4xl text-pearl">
            <p className="inline-flex rounded-full border border-white/35 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--event-secondary)] backdrop-blur-xl">
              {style.label}
            </p>
            <h1 className={`${style.font} mt-7 text-6xl leading-[0.9] tracking-[-0.03em] text-white drop-shadow-[0_8px_36px_rgba(0,0,0,0.42)] sm:text-8xl lg:text-9xl`}>
              {event.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/90 sm:text-2xl">{event.subtitle}</p>
            <div className="mt-9 max-w-3xl">
              <Countdown date={event.date} time={event.time} />
            </div>
          </div>

          <aside className={`rounded-[2rem] border border-white/18 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl ${style.card}`}>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--event-secondary)]">{event.host}</p>
            <p className={`${style.font} mt-3 text-4xl leading-none text-white`}>{event.invitationNote}</p>
            <div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs font-black">
              <span className="rounded-full border border-white/16 px-3 py-2">Mapa</span>
              <span className="rounded-full border border-white/16 px-3 py-2">RSVP</span>
              <span className="rounded-full border border-white/16 px-3 py-2">QR</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] shadow-[0_28px_90px_rgba(17,17,20,0.15)]">
          <Image src={event.gallery[0]} alt={`${event.title} detalle premium`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--event-accent)]">Experiencia del invitado</p>
          <h2 className={`${style.font} mt-4 text-5xl leading-[0.95] tracking-[-0.025em] sm:text-7xl`}>Una invitación que se siente como el evento.</h2>
          <p className="mt-6 text-lg font-semibold leading-8 text-ink/70">{event.story}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Info icon={<CalendarDays size={20} />} title="Fecha" value={new Date(`${event.date}T00:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} />
            <Info icon={<Clock size={20} />} title="Hora" value={event.time} />
            <Info icon={<MapPin size={20} />} title="Lugar" value={`${event.venue} · ${event.address}`} />
            <Info icon={<Shirt size={20} />} title="Dress code" value={event.dressCode} />
            <Info icon={<Gift size={20} />} title="Mesa de regalos" value={event.giftTable} />
            <Info icon={<Music size={20} />} title="Música" value={event.music} />
          </div>
        </div>
      </section>

      <section className="bg-white/76 px-4 py-16 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--event-accent)]">Galería deluxe</p>
              <h2 className={`${style.font} mt-3 text-5xl leading-none sm:text-6xl`}>Visuales acordes al momento</h2>
            </div>
            <Link href={event.mapsUrl} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-pearl transition hover:bg-emerald">
              <MapPin size={16} />
              Abrir Google Maps
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {event.gallery.map((image, index) => (
              <div key={image} className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_24px_70px_rgba(17,17,20,0.14)]">
                <Image src={image} alt={`${event.title} galería ${index + 1}`} fill loading="lazy" sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
        <RSVPForm eventSlug={event.slug} />
        <div className="rounded-[2rem] bg-ink p-6 text-pearl shadow-[0_24px_80px_rgba(17,17,20,0.2)] sm:p-8">
          <div className="flex items-center gap-3 text-[var(--event-secondary)]">
            <QrCode />
            <p className="font-black uppercase tracking-[0.22em]">Código QR</p>
          </div>
          <div className="mt-7 grid gap-7 sm:grid-cols-[240px_1fr] sm:items-center">
            <Image src={qrUrl} alt={`QR ${event.title}`} width={240} height={240} className="rounded-2xl bg-white p-3" />
            <div>
              <p className={`${style.font} text-4xl leading-none text-white`}>Comparte esta invitación</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-pearl/76">Tus invitados pueden abrirla desde WhatsApp, confirmar asistencia, consultar el mapa y guardar el QR.</p>
              <Link href={buildWhatsAppUrl(event.whatsappMessage)} target="_blank" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--event-secondary)] px-5 py-3 text-sm font-black text-ink transition hover:bg-pearl">
                <MessageCircle size={16} />
                Confirmar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          <Feature icon={<Sparkles />} title="Diseño exclusivo" text={`Estética creada para ${event.type.toLowerCase()}, sin apariencia genérica.`} />
          <Feature icon={<MessageCircle />} title="RSVP claro" text="Tus invitados confirman desde celular en segundos." />
          <Feature icon={<Music />} title="Ambiente completo" text="Música, galería, mapa y detalles en una experiencia fluida." />
        </div>
      </section>
    </div>
  );
}

function Info({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-ink/8 bg-white/86 p-5 shadow-[0_18px_55px_rgba(17,17,20,0.08)]">
      <div className="mb-4 inline-grid size-11 place-items-center rounded-full bg-[var(--event-secondary)] text-ink">{icon}</div>
      <p className="font-black text-ink">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">{value}</p>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-[1.75rem] border border-ink/8 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,20,0.08)]">
      <div className="inline-grid size-11 place-items-center rounded-full bg-ink text-pearl">{icon}</div>
      <h3 className="mt-5 text-xl font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">{text}</p>
    </article>
  );
}
