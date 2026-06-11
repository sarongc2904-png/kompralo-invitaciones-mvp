import { PricingCards } from "@/components/PricingCards";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Precios"
};

export default function PreciosPage() {
  return (
    <section className="soft-pattern px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Planes"
          title="Paquetes simples, comerciales y listos para cobrar"
          description="Precios pensados para lanzar rapido sin convertir el producto en un SaaS complejo."
        />
        <div className="mt-12">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}
