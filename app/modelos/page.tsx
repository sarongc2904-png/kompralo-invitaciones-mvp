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
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(198,161,91,0.18),transparent_32%),radial-gradient(circle_at_88%_10%,rgba(32,75,59,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Catálogo curado"
            title="Elige un diseño, abre la demo y personalízalo"
            description="Modelos premium para bodas, XV años, bautizos y cumpleaños. Puedes ver una demo pública antes de comprar."
          />
          <div className="mt-14 grid gap-14">
            {categories.map((category) => (
              <section key={category}>
                <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
                  <h2 className="font-display text-4xl text-ink">{category}</h2>
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Desde $399 MXN</span>
                </div>
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
        </div>
      </section>
    </div>
  );
}
