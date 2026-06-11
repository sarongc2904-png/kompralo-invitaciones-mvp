import { Check, CreditCard, Crown } from "lucide-react";
import { plans } from "@/data/plans";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`relative overflow-hidden rounded-[1.5rem] p-7 shadow-[0_26px_90px_rgba(17,17,20,0.12)] transition duration-500 hover:-translate-y-2 ${
            plan.highlighted ? "bg-ink text-pearl ring-1 ring-gold/50" : "bg-white text-ink ring-1 ring-ink/8"
          }`}
        >
          {plan.highlighted ? (
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-black text-ink">
              <Crown size={14} />
              Más vendido
            </div>
          ) : null}
          <p className={`text-sm font-black uppercase tracking-[0.24em] ${plan.highlighted ? "text-gold" : "text-rose"}`}>
            {plan.name}
          </p>
          <p className="mt-5 font-display text-5xl leading-none">{plan.price}</p>
          <p className={`mt-4 min-h-14 text-sm leading-6 ${plan.highlighted ? "text-pearl/72" : "text-ink/62"}`}>
            {plan.description}
          </p>
          <ul className="mt-7 grid gap-4 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 shrink-0 text-gold" size={18} />
                <span className="font-semibold">{feature}</span>
              </li>
            ))}
          </ul>
          <form action="/api/checkout" method="POST" className="mt-8">
            <input type="hidden" name="planId" value={plan.id} />
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-black transition ${
                plan.highlighted
                  ? "bg-gold text-ink hover:bg-pearl"
                  : "bg-ink text-pearl hover:bg-emerald"
              }`}
            >
              <CreditCard className="mr-2" size={17} />
              Comprar ahora
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}
