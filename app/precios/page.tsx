import Link from "next/link";
import {
  IconBrandWhatsapp,
  IconCheck,
  IconClockHour4,
  IconCreditCard,
  IconRosetteDiscountCheck,
  IconSparkles,
  IconStarFilled,
  IconTruckDelivery
} from "@tabler/icons-react";
import { plans } from "@/data/plans";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = {
  title: "Precios | Kompralo Invitaciones Digitales",
  description: "Elige tu invitacion digital premium, paga seguro y recibe una experiencia lista para compartir por WhatsApp."
};

const stats = [
  { label: "+840 momentos entregados", icon: IconTruckDelivery },
  { label: "4.9/5 experiencia", icon: IconStarFilled },
  { label: "Lista en menos de 24 hrs", icon: IconClockHour4 },
  { label: "68% vuelven a comprar", icon: IconRosetteDiscountCheck }
];

const testimonials = [
  {
    quote: "La invitacion se sintio elegante desde el primer vistazo. Mis invitados confirmaron en minutos.",
    name: "Mariana G.",
    event: "Boda en Queretaro"
  },
  {
    quote: "Me resolvieron todo rapido: musica, mapa, QR y mesa de regalos. Se veia muy premium.",
    name: "Fernanda R.",
    event: "XV anos en Monterrey"
  },
  {
    quote: "La compartimos por WhatsApp y dejamos de perseguir confirmaciones. Super practico.",
    name: "Luis A.",
    event: "Bautizo en CDMX"
  },
  {
    quote: "Compre el plan completo y en menos de 24 horas ya tenia todo listo para enviar.",
    name: "Paola M.",
    event: "Baby Shower en Guadalajara"
  }
];

export default async function PreciosPage({
  searchParams
}: {
  searchParams?: Promise<{ modelo?: string; cancelado?: string }>;
}) {
  const params = await searchParams;
  const modelo = params?.modelo ?? "";

  return (
    <main className="bg-[#f7f3eb] text-[#111114]">
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d2ae5f]/40 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">
              <IconSparkles size={16} />
              Invitaciones listas para emocionar
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Elige la experiencia que tus invitados van a recordar.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/68 sm:text-lg">
              Paga seguro, personaliza tu evento y recibe una invitacion digital elegante, facil de compartir por WhatsApp y preparada para confirmar asistencia sin perseguir invitados.
            </p>
            {params?.cancelado ? (
              <p className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#b05a5f] shadow-sm">
                El pago fue cancelado. Puedes elegir otro plan cuando quieras.
              </p>
            ) : null}
          </div>

          <div className="mt-9 grid gap-3 rounded-[1.2rem] border border-black/10 bg-white p-3 shadow-[0_20px_70px_rgba(17,17,20,0.08)] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-center gap-2 rounded-2xl bg-[#fbfaf7] px-4 py-4 text-sm font-black">
                  <Icon size={20} className="text-[#c9a24f]" />
                  {stat.label}
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={[
                  "relative flex min-h-[560px] flex-col rounded-[1.35rem] border p-7 shadow-[0_20px_70px_rgba(17,17,20,0.08)]",
                  plan.id === "premium"
                    ? "border-[#d2ae5f]/45 bg-[#111114] text-white"
                    : plan.highlighted
                      ? "border-blue-500 bg-white text-[#111114] ring-2 ring-blue-500"
                      : "border-black/10 bg-white text-[#111114]"
                ].join(" ")}
              >
                {plan.badge || plan.highlighted ? (
                  <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                    {plan.badge ?? "Mas elegido"}
                  </div>
                ) : null}
                <p className={["text-xs font-black uppercase tracking-[0.22em]", plan.id === "premium" ? "text-[#d2ae5f]" : "text-[#bd7890]"].join(" ")}>
                  Plan {plan.name}
                </p>
                <div className="mt-7 flex items-end gap-3">
                  <span className={["text-2xl font-bold line-through", plan.id === "premium" ? "text-white/42" : "text-black/35"].join(" ")}>
                    {plan.oldPrice}
                  </span>
                  <span className="font-display text-5xl leading-none">{plan.price}</span>
                </div>
                <p className={["mt-5 min-h-16 text-sm leading-7", plan.id === "premium" ? "text-white/72" : "text-black/65"].join(" ")}>
                  {plan.description}
                </p>
                <ul className="mt-7 grid gap-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className={["flex items-center gap-3 text-sm font-bold", plan.id === "premium" ? "text-white" : "text-black/82"].join(" ")}>
                      <span className={["grid size-7 place-items-center rounded-full", plan.id === "premium" ? "bg-white/10 text-[#d2ae5f]" : "bg-[#f4ead4] text-[#ae7d2e]"].join(" ")}>
                        <IconCheck size={17} stroke={2.2} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <form action="/api/checkout" method="POST" className="mt-auto pt-8">
                  <input type="hidden" name="plan_slug" value={plan.id} />
                  {modelo ? <input type="hidden" name="modelo" value={modelo} /> : null}
                  <button
                    type="submit"
                    className={[
                      "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition hover:-translate-y-0.5",
                      plan.highlighted ? "bg-blue-600 text-white hover:bg-blue-700" : plan.id === "premium" ? "bg-[#d2ae5f] text-black hover:bg-[#e2c270]" : "bg-[#111114] text-white hover:bg-[#1f513f]"
                    ].join(" ")}
                  >
                    <IconCreditCard size={19} />
                    Comprar {plan.name}
                  </button>
                </form>
              </article>
            ))}
          </div>

          <section className="mt-16">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">Prueba social</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">Clientes que ya lo compartieron</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="rounded-[1.2rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(17,17,20,0.06)]">
                  <div className="flex gap-1 text-[#d2ae5f]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <IconStarFilled key={index} size={16} />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm font-semibold leading-7 text-black/72">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5">
                    <p className="font-black">{testimonial.name}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/42">{testimonial.event}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <div className="mt-14 rounded-[1.35rem] bg-[#111114] p-5 text-white shadow-[0_24px_80px_rgba(17,17,20,0.18)] sm:p-7">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d2ae5f]">Compra asistida</p>
                <h2 className="mt-2 font-display text-3xl">Te ayudamos a elegir el plan ideal.</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">Escribenos por WhatsApp y te recomendamos el plan segun tu evento.</p>
              </div>
              <Link
                href={buildWhatsAppUrl("Hola, quiero ayuda para elegir mi invitacion digital.")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-6 py-4 text-sm font-black text-black"
              >
                <IconBrandWhatsapp size={20} />
                Hablar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
