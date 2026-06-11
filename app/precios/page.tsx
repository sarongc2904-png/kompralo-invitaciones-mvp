import { PricingCards } from "@/components/PricingCards";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Precios"
};

type PreciosPageProps = {
  searchParams: Promise<{
    cancelado?: string;
  }>;
};

export default async function PreciosPage({ searchParams }: PreciosPageProps) {
  const { cancelado } = await searchParams;

  return (
    <section className="soft-pattern px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Planes"
          title="Paquetes simples, comerciales y listos para cobrar"
          description="Precios pensados para lanzar rapido sin convertir el producto en un SaaS complejo."
        />
        {cancelado ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-4 text-center text-sm font-semibold text-ink shadow-glow luxury-border">
            El pago se canceló. Puedes elegir un plan y volver a intentarlo cuando quieras.
          </div>
        ) : null}
        <div className="mt-12">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}
