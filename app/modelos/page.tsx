import { SectionHeading } from "@/components/SectionHeading";
import { TemplateCard } from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import { categories } from "@/lib/categories";

export const metadata = {
  title: "Modelos"
};

export default function ModelosPage() {
  return (
    <div className="bg-pearl">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catálogo visual"
          title="12 plantillas premium para vender desde el primer día"
          description="Cada modelo incluye miniatura, vista previa y selección directa para iniciar el pedido."
        />
        <div className="mt-12 grid gap-12">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="mb-5 font-display text-3xl text-ink">{category}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {templates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
