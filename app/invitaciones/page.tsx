import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  Gem,
  MapPinned,
  MessageCircle,
  Play,
  QrCode,
  Sparkles,
  Star,
  Wand2
} from "lucide-react";
import { faqs } from "@/data/faqs";
import { templates } from "@/data/templates";
import { PricingCards } from "@/components/PricingCards";
import { TemplateCard } from "@/components/TemplateCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const heroImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85";

export default function InvitacionesPage() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-ink text-pearl">
        <Image src={heroImage} alt="Boda premium con invitación digital Kompralo" fill priority sizes="100vw" className="object-cover opacity-72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,161,91,0.24),transparent_28%),linear-gradient(90deg,rgba(8,8,10,0.92),rgba(8,8,10,0.54)_48%,rgba(8,8,10,0.24))]" />
        <div className="relative mx-auto grid min-h-screen max-w-7xl items-end px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-5xl pb-10">
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-pearl/18 bg-pearl/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gold backdrop-blur-xl">
              <Sparkles size={14} />
              Invitaciones digitales de alto impacto
            </div>
            <h1 className="reveal mt-7 max-w-5xl font-display text-6xl leading-[0.9] text-balance sm:text-7xl lg:text-8xl">
              El primer momento memorable de tu evento empieza aquí.
            </h1>
            <p className="reveal mt-7 max-w-2xl text-lg leading-8 text-pearl/76 sm:text-xl">
              Diseñamos invitaciones digitales premium para XV años, bodas, bautizos y cumpleaños en México:
              elegantes, rápidas, compartibles y hechas para confirmar asistencia.
            </p>
            <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/formulario" className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-black text-ink shadow-[0_20px_60px_rgba(198,161,91,0.28)] transition hover:-translate-y-0.5 hover:bg-pearl">
                Crear mi invitación ahora
                <ArrowRight size={17} />
              </Link>
              <Link href="/demo/boda" className="inline-flex items-center justify-center gap-2 rounded-full border border-pearl/22 bg-pearl/10 px-7 py-4 text-sm font-bold text-pearl backdrop-blur-xl transition hover:border-gold hover:text-gold">
                <Play size={16} />
                Ver demo real
              </Link>
            </div>
          </div>
          <div className="grid gap-3 border-t border-pearl/14 pt-5 text-sm text-pearl/74 sm:grid-cols-3">
            <Metric value="3 min" label="para enviar datos del evento" />
            <Metric value="12" label="modelos listos para vender" />
            <Metric value="24/7" label="abierta para tus invitados" />
          </div>
        </div>
      </section>

      <section className="bg-pearl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="eyebrow">Experiencia del invitado</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">No mandas un link. Mandas una sensación.</h2>
            <p className="mt-6 text-lg leading-8 text-ink/68">
              Tus invitados abren la invitación desde WhatsApp, sienten el estilo del evento, ven mapa, música, galería,
              dress code, mesa de regalos y confirman asistencia sin fricción.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(198,161,91,0.18),transparent_36%)]" />
            <div className="relative grid gap-4 md:grid-cols-3">
              {[
                ["Abre", "Un enlace elegante llega por WhatsApp.", MessageCircle],
                ["Explora", "Fotos, música, mapa y código de vestir.", Gem],
                ["Confirma", "RSVP y contacto inmediato en segundos.", BadgeCheck]
              ].map(([title, text, Icon], index) => (
                <article key={String(title)} className="premium-panel min-h-64 p-6 transition duration-500 hover:-translate-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-gold">0{index + 1}</span>
                  <Icon className="mt-8 text-emerald" size={30} />
                  <h3 className="mt-5 font-display text-3xl text-ink">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/62">{String(text)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Showcase</p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl leading-none text-ink sm:text-6xl">Modelos que se sienten diseñados, no rellenados.</h2>
            </div>
            <Link href="/modelos" className="inline-flex items-center gap-2 text-sm font-black text-emerald">
              Ver catálogo completo
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {templates.slice(0, 4).map((template) => (
              <TemplateCard key={template.id} template={template} variant="editorial" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-20 text-pearl sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold">Demo funcional</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Una invitación real, lista para compartir.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-pearl/68">
              Portada cinematográfica, fecha, hora, dirección, RSVP, WhatsApp y estética premium en móvil.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Cuenta regresiva", "RSVP", "Mapa", "QR", "WhatsApp"].map((item) => (
                <span key={item} className="rounded-full border border-pearl/16 px-4 py-2 text-sm text-pearl/78">{item}</span>
              ))}
            </div>
            <Link href="/demo/boda" className="mt-9 inline-flex items-center gap-2 rounded-full bg-pearl px-7 py-4 text-sm font-black text-ink transition hover:bg-gold">
              Abrir demo premium
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-sm rounded-[2.4rem] border border-pearl/20 bg-pearl/8 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="overflow-hidden rounded-[1.8rem] bg-ink">
              <div className="relative aspect-[9/16]">
                <Image src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=82" alt="Demo de invitación digital para boda" fill sizes="360px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Boda</p>
                  <h3 className="mt-2 font-display text-4xl leading-none">Andrea & Mateo</h3>
                  <p className="mt-3 text-sm text-pearl/75">17 octubre · Hacienda Santa Elena</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                    {["Mapa", "RSVP", "QR"].map((item) => (
                      <span key={item} className="rounded-full bg-pearl/14 px-3 py-2 backdrop-blur">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pearl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Comparativa</p>
          <h2 className="mt-4 max-w-4xl font-display text-5xl leading-none text-ink sm:text-6xl">La diferencia no es digital. Es percepción.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Comparison title="Invitación tradicional" muted items={["Se pierde en chats", "Sin RSVP automático", "Cambios lentos", "No mide interés", "Difícil de reenviar"]} />
            <Comparison title="Digital Premium Kompralo" items={["Link listo para WhatsApp", "Confirmación RSVP", "Mapa, música y galería", "Diseño premium móvil", "QR y actualización rápida"]} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Prueba social</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">Hecho para vender valor, no solo una imagen bonita.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Proof value="+40%" label="más intención de confirmar" />
            <Proof value="1 link" label="para toda la experiencia" />
            <Proof value="95+" label="objetivo Lighthouse" />
          </div>
        </div>
      </section>

      <section className="bg-champagne/55 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Planes</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">Elige el nivel de presencia que tendrá tu evento.</h2>
          </div>
          <div className="mt-12">
            <PricingCards />
          </div>
        </div>
      </section>

      <section className="bg-pearl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-center">FAQ</p>
          <h2 className="mt-4 text-center font-display text-5xl leading-none text-ink">Preguntas antes de empezar</h2>
          <div className="mt-10 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_18px_55px_rgba(17,17,20,0.08)]">
                <summary className="cursor-pointer list-none font-semibold text-ink">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-ink/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-4 py-24 text-center text-pearl sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(198,161,91,0.22),transparent_35%)]" />
        <div className="relative mx-auto max-w-4xl">
          <Wand2 className="mx-auto text-gold" size={38} />
          <h2 className="mt-6 font-display text-5xl leading-none sm:text-7xl">Convierte tu evento en una experiencia desde el primer mensaje.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pearl/68">Crea hoy tu invitación digital premium y compártela en minutos.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/formulario" className="rounded-full bg-gold px-8 py-4 text-sm font-black text-ink transition hover:bg-pearl">
              Crear invitación
            </Link>
            <Link href={buildWhatsAppUrl("Hola, quiero información sobre una invitación digital.")} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-pearl/20 px-8 py-4 text-sm font-black text-pearl transition hover:border-gold hover:text-gold">
              <MessageCircle size={17} />
              Hablar por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Link href="/formulario" className="fixed inset-x-4 bottom-4 z-40 rounded-full bg-ink px-5 py-4 text-center text-sm font-black text-pearl shadow-[0_18px_60px_rgba(0,0,0,0.26)] md:hidden">
        Crear mi invitación premium
      </Link>
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-pearl">{value}</p>
      <p className="mt-1 text-pearl/62">{label}</p>
    </div>
  );
}

function Comparison({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <article className={`rounded-[1.5rem] p-7 shadow-[0_18px_70px_rgba(17,17,20,0.10)] ${muted ? "border border-ink/8 bg-white/60 text-ink/62" : "border border-gold/45 bg-ink text-pearl"}`}>
      <h3 className={`font-display text-4xl ${muted ? "text-ink" : "text-pearl"}`}>{title}</h3>
      <div className="mt-7 grid gap-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Check className={muted ? "text-ink/35" : "text-gold"} size={18} />
            <span className="text-sm font-semibold">{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Proof({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[1.25rem] border border-ink/8 bg-pearl p-6 text-center">
      <Star className="mx-auto text-gold" size={22} />
      <p className="mt-4 font-display text-4xl text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ink/62">{label}</p>
    </article>
  );
}
