import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";

export const metadata = {
  title: "Precios"
};

export default function PreciosPage() {
  return (
    <section className="soft-pattern px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow justify-center">Planes de alto valor</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] text-ink sm:text-7xl">
            Precios simples para vender una experiencia premium.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            Compra el plan, completa los datos y recibe una invitación digital lista para compartir.
          </p>
        </div>
        <div className="mt-14">
          <PricingCards />
        </div>
        <div className="mt-10 grid gap-4 rounded-[1.5rem] border border-gold/35 bg-white/72 p-6 shadow-[0_22px_70px_rgba(17,17,20,0.10)] backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 text-emerald" size={26} />
            <div>
              <h2 className="font-display text-3xl text-ink">Compra guiada por WhatsApp</h2>
              <p className="mt-2 text-sm leading-6 text-ink/62">Si prefieres trato directo, te ayudamos a elegir modelo, plan y estilo.</p>
            </div>
          </div>
          <Link href="/formulario" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-black text-pearl transition hover:bg-emerald">
            Empezar pedido
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
