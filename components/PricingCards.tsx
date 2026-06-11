import { Check, CreditCard } from "lucide-react";
import { plans } from "@/data/plans";

export function PricingCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`rounded-lg p-6 shadow-glow luxury-border ${
            plan.highlighted ? "bg-ink text-pearl" : "bg-white text-ink"
          }`}
        >
          <p className={`text-sm font-bold uppercase tracking-[0.22em] ${plan.highlighted ? "text-gold" : "text-rose"}`}>
            {plan.name}
          </p>
          <p className="mt-4 font-display text-4xl">{plan.price}</p>
          <p className={`mt-3 text-sm leading-6 ${plan.highlighted ? "text-pearl/70" : "text-ink/62"}`}>
            {plan.description}
          </p>
          <ul className="mt-6 grid gap-3 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 shrink-0 text-gold" size={17} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <form action="/api/checkout" method="POST" className="mt-7">
            <input type="hidden" name="planId" value={plan.id} />
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-bold transition ${
                plan.highlighted
                  ? "bg-gold text-ink hover:bg-pearl"
                  : "bg-ink text-pearl hover:bg-emerald"
              }`}
            >
              <CreditCard className="mr-2" size={16} />
              Comprar
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}
