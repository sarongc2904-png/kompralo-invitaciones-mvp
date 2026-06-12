import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TemplateCreateForm } from "@/components/dashboard/TemplateCreateForm";
import { TemplateActions } from "@/components/dashboard/TemplateActions";
import { templates as defaultTemplates } from "@/data/templates";
import { requireAdmin } from "@/lib/auth-guards";
import { resolveImageUrl } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const categoryOrder = ["Bodas", "XV años", "Bautizos", "Cumpleaños", "Baby Shower"];

const commercialNames: Record<string, string> = {
  "boda-black-gold": "Elegancia Dorada",
  "xv-rosa-dorado": "Rosa Imperial",
  "xv-royal-blue": "Azul Majestuoso",
  "xv-princess-gold": "Princesa Dorada",
  "boda-white-floral": "Jardín Blanco",
  "boda-olive-luxury": "Olivo Luxury",
  "bautizo-classic-beige": "Beige Celestial",
  "bautizo-sky-blue": "Cielo Azul",
  "bautizo-minimal-white": "Blanco Sagrado",
  "cumple-neon-party": "Neón Celebration",
  "cumple-black-premium": "Noche Premium",
  "cumple-tropical-luxury": "Tropical Luxury",
  "baby-shower-deluxe": "Baby Shower Deluxe",
  "baby-blush-gold": "Dulce Blush",
  "baby-sky-dream": "Cielo de Ensueño",
  "baby-minimal-luxe": "Minimal Baby Luxe"
};

type AdminTemplate = Awaited<ReturnType<typeof prisma.template.findMany>>[number];
type TemplateForAdmin = Pick<AdminTemplate, "id" | "name" | "category" | "description" | "imageUrl" | "previewUrl" | "isActive">;

export default async function AdminTemplatesPage() {
  const session = await requireAdmin();
  await ensureDefaultTemplates();

  const templates = await prisma.template
    .findMany({ orderBy: [{ category: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);
  const existingTemplateIds = new Set(templates.map((template) => template.id));
  const missingDefaultTemplates: TemplateForAdmin[] = defaultTemplates
    .filter((template) => !existingTemplateIds.has(template.id))
    .map((template) => ({
      id: template.id,
      name: template.name,
      category: template.category,
      description: template.palette,
      imageUrl: template.imageUrl,
      previewUrl: template.previewUrl,
      isActive: true
    }));
  const allTemplates: TemplateForAdmin[] = [...templates, ...missingDefaultTemplates];

  const groupedTemplates = categoryOrder.map((category) => ({
    category,
    templates: allTemplates.filter((template) => template.category === category)
  }));
  const uncategorized = allTemplates.filter((template) => !categoryOrder.includes(template.category));
  const sections = [
    ...groupedTemplates,
    ...(uncategorized.length ? [{ category: "Sin categoría", templates: uncategorized }] : [])
  ];

  return (
    <DashboardShell title="Plantillas" description="Edita nombres, categoría, imagen, vista previa y estado de cada modelo." role={session.user.role}>
      <TemplateCreateForm />

      <div className="mt-10 grid gap-12">
        {sections.map(({ category, templates }) => (
          <section key={category}>
            <div className="mb-5 flex flex-col gap-2 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Categoría</p>
                <h2 className="mt-1 font-display text-4xl text-ink">{category}</h2>
              </div>
              <span className="text-sm font-bold text-ink/55">
                {templates.length} plantilla{templates.length === 1 ? "" : "s"}
              </span>
            </div>

            {templates.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((template) => (
                  <TemplateAdminCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-ink/12 bg-white p-5 text-sm font-semibold text-ink/55">
                Todavía no hay plantillas en esta categoría.
              </p>
            )}
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}

async function ensureDefaultTemplates() {
  await Promise.all(
    defaultTemplates.map((template) =>
      prisma.template.upsert({
        where: { id: template.id },
        update: {
          name: template.name,
          category: template.category,
          description: template.palette,
          imageUrl: template.imageUrl,
          previewUrl: template.previewUrl,
          isActive: true
        },
        create: {
          id: template.id,
          name: template.name,
          category: template.category,
          description: template.palette,
          imageUrl: template.imageUrl,
          previewUrl: template.previewUrl,
          isActive: true
        }
      })
    )
  ).catch(() => null);
}

function TemplateAdminCard({ template }: { template: TemplateForAdmin }) {
  const displayName = commercialNames[template.id] ?? template.name;
  const displayDescription = template.description || "Diseño premium listo para personalizar.";

  return (
    <article className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_65px_rgba(17,17,20,0.08)] ring-1 ring-ink/8">
      <div className="relative aspect-[16/10] bg-pearl">
        <Image src={resolveImageUrl(template.imageUrl)} alt={displayName} fill sizes="(min-width: 1280px) 33vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-pearl/90 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-ink">
          {template.category}
        </span>
      </div>
      <div className="p-5">
        <h2 className="font-display text-3xl text-ink">{displayName}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/62">{displayDescription}</p>
        <p className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${template.isActive ? "text-emerald" : "text-rose"}`}>
          {template.isActive ? "Activa" : "Inactiva"}
        </p>
        <TemplateActions template={{ ...template, name: displayName, description: displayDescription }} />
      </div>
    </article>
  );
}
