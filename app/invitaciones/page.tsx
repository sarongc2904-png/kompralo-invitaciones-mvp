import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Gem, MapPinned, MessageCircle, Sparkles } from "lucide-react";
import { faqs } from "@/data/faqs";
import { templates } from "@/data/templates";
import { PricingCards } from "@/components/PricingCards";
import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function InvitacionesPage() {
  return (
    <>
      <section className="soft-pattern">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="fade-up">
            <p className="mb-4 inline-flex rounded-full border border-gold/40 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-rose">
              Invitaciones digitales premium
            </p>
            <h1 className="font-display text-5xl leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
              Vende experiencias elegantes para eventos inolvidables.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
              XV años, bodas, bautizos y cumpleaños con diseño de lujo, RSVP, mapas, galería,
              WhatsApp y código QR listos para compartir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/formulario"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-4 text-sm font-bold text-pearl shadow-glow transition hover:-translate-y-0.5 hover:bg-emerald"
              >
                Crear mi invitación
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/modelos"
                className="inline-flex items-center justify-center rounded-md border border-ink/12 bg-white/70 px-6 py-4 text-sm font-bold text-ink transition hover:border-gold"
              >
                Ver modelos
              </Link>
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg shadow-glow luxury-border">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              alt="Invitación digital premium para boda"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-lg border border-gold/50 bg-pearl/96 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <p className="font-display text-3xl text-ink drop-shadow-sm">Andrea & Mateo</p>
              <p className="mt-2 text-sm font-semibold text-ink/75">17 octubre · Hacienda Santa Elena</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Beneficios" title="Todo lo que hace que una invitación se sienta premium" />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            ["Diseño elegante", Gem],
            ["Entrega rápida", Clock],
            ["RSVP integrado", BadgeCheck],
            ["Mapas y WhatsApp", MapPinned]
          ].map(([title, Icon]) => (
            <div key={String(title)} className="rounded-lg bg-white p-6 shadow-glow luxury-border">
              <Icon className="text-gold" size={28} />
              <p className="mt-5 font-display text-2xl text-ink">{String(title)}</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                Experiencia clara, visual y optimizada para que tus invitados abran todo desde el celular.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Proceso" title="Cómo funciona" description="Un flujo simple para comprar hoy y entregar la información sin fricción." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Elige modelo y plan", "Llena el formulario", "Recibe tu enlace final"].map((step, index) => (
              <div key={step} className="rounded-lg bg-pearl p-6 luxury-border">
                <span className="font-display text-5xl text-gold">0{index + 1}</span>
                <p className="mt-4 font-semibold text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Galería" title="Modelos listos para vender" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.slice(0, 4).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="bg-champagne/55 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Paquetes" title="Precios claros para lanzar rápido" />
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes" />
        <div className="mt-10 grid gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-lg bg-white p-5 shadow-glow luxury-border">
              <summary className="cursor-pointer font-semibold text-ink">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-ink/65">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-ink px-4 py-16 text-center text-pearl">
        <Sparkles className="mx-auto text-gold" size={34} />
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl sm:text-5xl">Lista para vender invitaciones premium con Kompralo.</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/formulario" className="rounded-md bg-gold px-6 py-4 text-sm font-bold text-ink transition hover:bg-pearl">
            Empezar pedido
          </Link>
          <Link
            href={buildWhatsAppUrl("Hola, quiero información sobre una invitación digital.")}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md border border-pearl/20 px-6 py-4 text-sm font-bold text-pearl transition hover:border-gold"
          >
            <MessageCircle size={17} />
            WhatsApp
          </Link>
        </div>
      </section>
    </>
  );
}
