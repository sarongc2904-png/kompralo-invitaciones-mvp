import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, ChevronRight, Gem, MessageCircle, Palette, Send, Sparkles, SquarePen, Star, Wand2 } from "lucide-react";
import { faqs } from "@/data/faqs";
import { templates } from "@/data/templates";
import { PricingCards } from "@/components/PricingCards";
import { TemplateCard } from "@/components/TemplateCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const heroImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85";

const socialProof = [
  {
    value: "+100",
    label: "invitaciones creadas",
    detail: "Bodas, XV anos, bautizos, cumpleanos y baby showers."
  },
  {
    value: "4.9/5",
    label: "satisfaccion de clientes",
    detail: "Por diseno, rapidez y facilidad para compartir."
  },
  {
    value: "24 h",
    label: "entrega express disponible",
    detail: "Para eventos cercanos que necesitan verse premium."
  }
];

const testimonials = [
  {
    quote: "La invitacion se veia mucho mas elegante que una imagen normal. Todos confirmaron por WhatsApp rapidisimo.",
    name: "Mariana G.",
    event: "Boda en Monterrey"
  },
  {
    quote: "Incluia mapa, musica, fotos y RSVP. Se sintio como una experiencia, no como un simple link.",
    name: "Fernanda L.",
    event: "XV anos en CDMX"
  }
];

const steps = [
  {
    title: "Elige tu diseno",
    text: "Selecciona una plantilla premium que conecte con el estilo de tu evento.",
    icon: Palette
  },
  {
    title: "Personaliza tus datos",
    text: "Agrega fecha, ubicacion, musica, fotos, dress code y detalles importantes.",
    icon: SquarePen
  },
  {
    title: "Recibe tu invitacion digital",
    text: "Te entregamos una experiencia lista para enviar, revisar y compartir.",
    icon: Send
  },
  {
    title: "Compartela por WhatsApp",
    text: "Tus invitados abren el link, ven la informacion y confirman asistencia.",
    icon: MessageCircle
  }
];

const benefits = [
  "RSVP en tiempo real",
  "Código QR para acceso",
  "Música personalizada",
  "Google Maps",
  "Mesa de regalos",
  "Galería de fotos",
  "Diseño adaptable a celular"
];

export default function InvitacionesPage() {
  return (
    <>
      <section id="inicio" className="relative min-h-screen scroll-mt-24 overflow-hidden bg-ink text-pearl">
        <Image src={heroImage} alt="Invitaciones digitales premium Kompralo" fill priority sizes="100vw" className="object-cover opacity-72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,161,91,0.24),transparent_28%),linear-gradient(90deg,rgba(8,8,10,0.94),rgba(8,8,10,0.58)_50%,rgba(8,8,10,0.25))]" />
        <div className="relative mx-auto grid min-h-screen max-w-7xl items-end px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-5xl pb-10">
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-pearl/18 bg-pearl/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gold backdrop-blur-xl">
              <Sparkles size={14} />
              Invitaciones digitales de alto impacto
            </div>
            <h1 className="reveal mt-7 max-w-5xl font-display text-5xl leading-[0.95] text-balance sm:text-7xl lg:text-8xl">
              Crea invitaciones digitales premium en minutos
            </h1>
            <p className="reveal mt-7 max-w-2xl text-lg leading-8 text-pearl/82 sm:text-xl">
              Diseños elegantes para bodas, XV años y eventos especiales. Personaliza, comparte por WhatsApp y recibe confirmaciones en tiempo real.
            </p>
            <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/modelos" className="magnetic inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-black text-ink shadow-[0_20px_60px_rgba(198,161,91,0.28)] transition hover:-translate-y-0.5 hover:bg-pearl">
                Ver modelos
                <ArrowRight size={17} />
              </Link>
              <Link href="/formulario" className="inline-flex items-center justify-center gap-2 rounded-full border border-pearl/22 bg-pearl/10 px-7 py-4 text-sm font-bold text-pearl backdrop-blur-xl transition hover:border-gold hover:text-gold">
                Crear mi invitación
              </Link>
            </div>
          </div>
          <div className="grid gap-3 pt-5 text-sm text-pearl/74 sm:grid-cols-3">
            <Metric value="3 min" label="para enviar datos del evento" />
            <Metric value="12" label="modelos listos para vender" />
            <Metric value="24/7" label="abierta para tus invitados" />
          </div>
        </div>
      </section>

      <section id="prueba-social" className="relative scroll-mt-24 overflow-hidden bg-ink px-4 py-14 text-pearl sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(198,161,91,0.16),transparent_28%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.08),transparent_22%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <div className="grid gap-4 sm:grid-cols-3">
            {socialProof.map((item) => (
              <article key={item.label} className="rounded-[1.35rem] border border-pearl/12 bg-white/[0.07] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 font-display text-5xl leading-none text-gold">{item.value}</p>
                <p className="mt-2 text-base font-black text-white">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-pearl/68">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[1.35rem] border border-gold/24 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <BadgeCheck className="shrink-0 text-emerald" size={22} />
                </div>
                <p className="mt-4 text-lg font-bold leading-7 text-white">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-5 border-t border-pearl/12 pt-4">
                  <p className="text-sm font-black text-gold">{testimonial.name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-pearl/56">{testimonial.event}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>      <section id="como-funciona" className="scroll-mt-24 bg-pearl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">¿Cómo funciona?</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">Tu invitación lista sin complicarte.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/66">
              Un flujo simple para pasar de idea a invitación compartible en minutos, con una experiencia premium para tus invitados.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="group relative overflow-hidden rounded-[1.4rem] border border-ink/8 bg-white p-6 shadow-[0_18px_55px_rgba(17,17,20,0.08)] transition duration-300 hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_26px_75px_rgba(17,17,20,0.12)]">
                  <div className="absolute -right-8 -top-8 size-28 rounded-full bg-gold/10 transition duration-300 group-hover:scale-125" />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="inline-grid size-10 place-items-center rounded-full bg-ink text-sm font-black text-gold">0{index + 1}</span>
                    <span className="grid size-12 place-items-center rounded-2xl border border-gold/35 bg-pearl text-gold shadow-[0_12px_34px_rgba(198,161,91,0.16)]">
                      <Icon size={24} strokeWidth={1.9} />
                    </span>
                  </div>
                  <h3 className="relative mt-7 text-xl font-black leading-7 text-ink">{step.title}</h3>
                  <p className="relative mt-3 text-sm font-semibold leading-6 text-ink/60">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="beneficios" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Beneficios incluidos</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">Todo lo que tus invitados necesitan en un solo link.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-pearl p-4">
                <Check className="shrink-0 text-gold" size={19} />
                <span className="text-sm font-bold text-ink/76">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="scroll-mt-24 bg-pearl px-4 py-20 sm:px-6 lg:px-8">
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

      <section id="modelos" className="scroll-mt-24 overflow-hidden bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Showcase</p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl leading-none text-ink sm:text-6xl">Modelos elegantes listos para personalizar.</h2>
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

      <section id="demo" className="scroll-mt-24 bg-ink px-4 py-20 text-pearl sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold">Demo funcional</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Prueba una invitación real antes de comprar.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-pearl/68">
              Mira portada, cuenta regresiva, mapa, RSVP, WhatsApp y código QR en una experiencia pública lista para compartir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Cuenta regresiva", "RSVP", "Mapa", "QR", "WhatsApp"].map((item) => (
                <span key={item} className="rounded-full border border-pearl/16 px-4 py-2 text-sm text-pearl/78">{item}</span>
              ))}
            </div>
            <Link href="/demo/boda" className="mt-9 inline-flex items-center gap-2 rounded-full bg-pearl px-7 py-4 text-sm font-black text-ink transition hover:bg-gold">
              Ver demo
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_35%_12%,rgba(198,161,91,0.26),transparent_34%),radial-gradient(circle_at_85%_82%,rgba(255,255,255,0.12),transparent_30%)] blur-sm" />
            <div className="relative rounded-[2.75rem] border border-gold/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] p-3 shadow-[0_45px_140px_rgba(0,0,0,0.62)] backdrop-blur">
              <div className="overflow-hidden rounded-[2rem] bg-[#070708] ring-1 ring-white/10">
                <div className="relative aspect-[9/16]">
                  <Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=88" alt="Demo deluxe de invitacion digital para boda" fill sizes="360px" className="object-cover" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_12%,rgba(255,255,255,0.22),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.92))]" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                    <span className="rounded-full border border-white/22 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                      Kompralo
                    </span>
                    <span className="grid size-10 place-items-center rounded-full border border-gold/45 bg-black/45 font-display text-lg text-gold shadow-[0_14px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                      K
                    </span>
                  </div>
                  <div className="absolute inset-x-5 top-[38%] grid grid-cols-3 gap-2">
                    {[
                      ["128", "Dias"],
                      ["08", "Hrs"],
                      ["49", "Min"]
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-2xl border border-white/18 bg-black/38 px-3 py-3 text-center shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                        <p className="font-display text-2xl leading-none text-white">{value}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.22em] text-gold">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] border border-gold/45 bg-[linear-gradient(135deg,rgba(10,10,10,0.88),rgba(10,10,10,0.66))] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-gold">Boda deluxe</p>
                      <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-ink">RSVP activo</span>
                    </div>
                    <h3 className="mt-3 font-display text-[2.55rem] leading-[0.9] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">Andrea & Mateo</h3>
                    <p className="mt-3 text-sm font-bold leading-5 text-white/92">17 octubre · Hacienda Santa Elena</p>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                      {["Mapa", "RSVP", "QR"].map((item) => (
                        <span key={item} className="rounded-full border border-white/18 bg-white/12 px-3 py-2 font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="comparativa" className="scroll-mt-24 bg-pearl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Comparativa</p>
          <h2 className="mt-4 max-w-4xl font-display text-5xl leading-none text-ink sm:text-6xl">Invitación impresa vs Invitación digital Kompralo.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Comparison title="Invitación impresa" muted items={["Mayor costo por impresión", "Entrega más lenta", "Difícil de compartir", "Sin confirmaciones automáticas", "No incluye mapa ni música"]} />
            <Comparison title="Digital Premium Kompralo" items={["Ahorro desde el primer envío", "Lista para compartir rápido", "WhatsApp, QR y Google Maps", "Confirmaciones RSVP en tiempo real", "Experiencia premium en celular"]} />
          </div>
        </div>
      </section>

      <section id="resultados" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Resultados</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">Hecho para vender valor, no solo una imagen bonita.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Proof value="+40%" label="más intención de confirmar" />
            <Proof value="1 link" label="para toda la experiencia" />
            <Proof value="95+" label="objetivo Lighthouse" />
          </div>
        </div>
      </section>

      <section id="planes" className="scroll-mt-24 bg-champagne/55 px-4 py-20 sm:px-6 lg:px-8">
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

      <section id="faq" className="scroll-mt-24 bg-pearl px-4 py-20 sm:px-6 lg:px-8">
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

      <section id="cta-final" className="relative scroll-mt-24 overflow-hidden bg-ink px-4 py-24 text-center text-pearl sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(198,161,91,0.22),transparent_35%)]" />
        <div className="relative mx-auto max-w-4xl">
          <Wand2 className="mx-auto text-gold" size={38} />
          <h2 className="mt-6 font-display text-5xl leading-none sm:text-7xl">Convierte tu evento en una experiencia desde el primer mensaje.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pearl/68">Crea hoy tu invitación digital premium y compártela en minutos.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/modelos" className="rounded-full bg-gold px-8 py-4 text-sm font-black text-ink transition hover:bg-pearl">
              Ver modelos
            </Link>
            <Link href={buildWhatsAppUrl("Hola, quiero información sobre una invitación digital.")} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-pearl/20 px-8 py-4 text-sm font-black text-pearl transition hover:border-gold hover:text-gold">
              <MessageCircle size={17} />
              Hablar por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Link href="/modelos" className="fixed inset-x-4 bottom-4 z-40 rounded-full bg-ink px-5 py-4 text-center text-sm font-black text-pearl shadow-[0_18px_60px_rgba(0,0,0,0.26)] md:hidden">
        Ver modelos disponibles
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
